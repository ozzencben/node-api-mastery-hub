import { Request, Response, NextFunction } from "express";
import { APIError } from "../../core/utils/APIError";
import prisma from "../../core/lib/prisma";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { AppointmentStatus } from "@prisma/client";
import { success } from "zod";

const timezone = "Europe/Istanbul";

// Business Controller
export const createBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.headers["x-user-id"] as string;

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const { name, category, description, workingHours } = req.body;

    const existingBusiness = await prisma.business.findFirst({
      where: {
        name: name,
        ownerId: ownerId,
      },
    });

    if (existingBusiness) {
      throw new APIError("Business with the same name already exists", 400);
    }

    const newBusiness = await prisma.business.create({
      data: {
        name: name,
        category: category,
        description: description,
        workingHours: workingHours,
        owner: { connect: { id: ownerId } },
      },
    });

    res
      .status(201)
      .json({ message: "Business created successfully", newBusiness });
  } catch (error) {
    next(error);
  }
};

export const getBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const ownerId = userId;

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const business = await prisma.business.findMany({
      where: {
        ownerId: ownerId,
      },
    });

    res
      .status(200)
      .json({ message: "Business fetched successfully", business });
  } catch (error) {
    next(error);
  }
};

export const updateBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.headers["x-user-id"] as string;
    const { businessId } = req.params as { businessId: string };
    const { name, category, description, workingHours } = req.body;

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const updatedBusiness = await prisma.business.updateMany({
      where: {
        id: businessId,
        ownerId: ownerId,
      },
      data: {
        name: name,
        category: category,
        description: description,
        workingHours: workingHours,
      },
    });

    if (updatedBusiness.count === 0) {
      throw new APIError("Business not found or not owned by the user", 404);
    }

    res.status(200).json({
      message: "Business updated successfully",
      data: {
        name: name,
        category: category,
        description: description,
        workingHours: workingHours,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.headers["x-user-id"] as string;
    const { businessId } = req.params as { businessId: string };

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const deletedBusiness = await prisma.business.deleteMany({
      where: {
        id: businessId,
        ownerId: ownerId,
      },
    });

    if (deletedBusiness.count === 0) {
      throw new APIError("Business not found or not owned by the user", 404);
    }

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getBusinessAppointmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { businessId } = req.params as { businessId: string };
    const { status, date } = req.query as { status?: string; date?: string };

    if (!userId) {
      throw new APIError("Unauthorized", 401);
    }

    const whereClause: any = {
      businessId: businessId,
      business: {
        ownerId: userId,
      },
    };

    if (status) {
      whereClause.status = status;
    }

    if (date) {
      const startDate = new Date(`${date}T00:00:00Z`);
      const endDate = new Date(`${date}T23:59:59Z`);
      whereClause.startTime = { gte: startDate, lte: endDate };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        service: true,
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { businessId, appointmentId } = req.params as {
      appointmentId: string;
      businessId: string;
    };
    const { status } = req.body as { status: AppointmentStatus };

    if (!userId) {
      throw new APIError("Unauthorized", 401);
    }

    const whereClause: any = {
      id: appointmentId,
      businessId: businessId,
      business: {
        ownerId: userId,
      },
    };

    const appointment = await prisma.appointment.findFirst({
      where: whereClause,
    });

    if (!appointment) {
      throw new APIError("Appointment not found or not owned by the user", 404);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: status,
      },
    });

    res.status(200).json({
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessDashboardHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { businessId } = req.params as { businessId: string };

    if (!userId) {
      throw new APIError("Unauthorized", 401);
    }

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userId,
      },
    });

    if (!business) {
      throw new APIError("Business not found or not owned by the user", 404);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        businessId: businessId,
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        service: true,
      },
    });

    const stats = {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,

      estimatedRevenue: appointments
        .filter((a) => a.status === "CONFIRMED")
        .reduce((sum, a) => {
          const price =
            typeof a.service.price === "object"
              ? Number(a.service.price)
              : parseFloat(a.service.price);
          return sum + price;
        }, 0),
    };

    res.status(200).json({
      success: true,
      date: new Date().toISOString().split("T")[0],
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, search, page, limit } = req.query as {
      category?: string;
      search?: string;
      page?: string;
      limit?: string;
    };

    const businesses = await prisma.business.findMany({
      where: {
        ...(category && { category: category }),
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      skip: page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Businesses fetched successfully",
      businesses,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessId } = req.params as { businessId: string };

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        services: {
          select: {
            name: true,
            description: true,
            duration: true,
            price: true,
          },
        },
      },
    });

    if (!business) {
      throw new APIError("Business not found", 404);
    }

    res.status(200).json({
      message: "Business details fetched successfully",
      business,
    });
  } catch (error) {
    next(error);
  }
};

// Service Controller
export const createServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.headers["x-user-id"] as string;
    const { businessId, name, description, duration, price } = req.body;

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: ownerId,
      },
    });

    if (!business) {
      throw new APIError("Business not found or not owned by the user", 404);
    }

    const newService = await prisma.service.create({
      data: {
        name: name,
        description: description,
        duration: duration,
        price: price,
        business: { connect: { id: businessId } },
      },
    });

    res
      .status(201)
      .json({ message: "Service created successfully", newService });
  } catch (error) {
    next(error);
  }
};

export const getServicesByBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const businessId = req.params.businessId as string;

    if (!userId) {
      throw new APIError("Unauthorized", 401);
    }

    const services = await prisma.service.findMany({
      where: {
        businessId: businessId,
        business: {
          ownerId: userId,
        },
      },
    });

    res
      .status(200)
      .json({ message: "Services fetched successfully", services });
  } catch (error) {
    next(error);
  }
};

export const updateServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.headers["x-user-id"] as string;
    const { serviceId } = req.params as { serviceId: string };
    const { name, description, duration, price } = req.body;

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const updatedService = await prisma.service.updateMany({
      where: {
        id: serviceId,
        business: {
          ownerId: ownerId,
        },
      },
      data: {
        name: name,
        description: description,
        duration: duration,
        price: price,
      },
    });

    if (updatedService.count === 0) {
      throw new APIError("Service not found or not owned by the user", 404);
    }

    res.status(200).json({
      message: "Service updated successfully",
      data: {
        name: name,
        description: description,
        duration: duration,
        price: price,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.headers["x-user-id"] as string;
    const { serviceId } = req.params as { serviceId: string };

    if (!ownerId) {
      throw new APIError("Unauthorized", 401);
    }

    const deletedService = await prisma.service.deleteMany({
      where: {
        id: serviceId,
        business: {
          ownerId: ownerId,
        },
      },
    });

    if (deletedService.count === 0) {
      throw new APIError("Service not found or not owned by the user", 404);
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Appointment Controller
export const createAppointmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string | undefined;
    const { serviceId, businessId, startTime, guestName, guestPhone } =
      req.body;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new APIError("Business not found", 404);
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new APIError("Service not found", 404);
    }

    const start = toDate(startTime, { timeZone: timezone });
    const end = new Date(start.getTime() + service.duration * 60000);
    const appointmentStartTime = formatInTimeZone(start, timezone, "HH:mm");
    const appointmentEndTime = formatInTimeZone(end, timezone, "HH:mm");

    let range = business?.workingHours;

    const [startHour, endHour] = range?.split("-") || ["00:00", "24:00"];

    const isMunites = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    const checkStart = isMunites(appointmentStartTime);
    const checkEnd = isMunites(appointmentEndTime);
    const rangeStart = isMunites(startHour);
    const rangeEnd = isMunites(endHour);

    if (checkStart < rangeStart || checkEnd > rangeEnd) {
      throw new APIError(
        "Appointment time is outside of business working hours",
        400,
      );
    }

    const overlappingAppointments = await prisma.appointment.findFirst({
      where: {
        businessId: businessId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });
    if (overlappingAppointments) {
      throw new APIError("Time slot is already booked", 400);
    }

    const appointmentData: any = {
      service: { connect: { id: serviceId } },
      business: { connect: { id: businessId } },
      startTime: start,
      endTime: end,
    };

    if (userId) {
      appointmentData.user = { connect: { id: userId } };
    } else {
      if (!guestName || !guestPhone) {
        throw new APIError(
          "Guest name and phone are required for unauthenticated bookings",
          400,
        );
      }
      appointmentData.guestName = guestName;
      appointmentData.guestPhone = guestPhone;
    }

    const newAppointment = await prisma.appointment.create({
      data: appointmentData,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailabilityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessId, serviceId, date } = req.query as {
      businessId: string;
      serviceId: string;
      date: string;
    };

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business || !business.workingHours) {
      throw new APIError("Business not found or working hours not set", 404);
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) throw new APIError("Service not found", 404);

    // Günün başlangıç ve bitişini belirle
    const startDate = new Date(`${date}T00:00:00Z`);
    const endDate = new Date(`${date}T23:59:59Z`);

    // DİKKAT: serviceId filtresini kaldırdık, dükkanın tüm randevularına bakıyoruz
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId: businessId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { gte: startDate, lte: endDate },
      },
    });

    const [openTime, closeTime] = business.workingHours.split("-");

    const toMinutes = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    let tempTime = toMinutes(openTime);
    const closingTime = toMinutes(closeTime);
    const serviceDuration = service.duration;

    const timeSlots = [];
    const now = new Date(); // Geçmiş saat kontrolü için

    while (tempTime + serviceDuration <= closingTime) {
      const slotStart = new Date(startDate);
      slotStart.setMinutes(tempTime);

      const slotEnd = new Date(startDate);
      slotEnd.setMinutes(tempTime + serviceDuration);

      const isOccupied = appointments.some((appointment) => {
        const appointmentStart = new Date(appointment.startTime).getTime();
        const appointmentEnd = new Date(appointment.endTime).getTime();
        const sStart = slotStart.getTime();
        const sEnd = slotEnd.getTime();
        return sStart < appointmentEnd && sEnd > appointmentStart;
      });

      // Geçmiş saat kontrolü: Eğer bugünse, şu andan önceki saatleri kapat
      const isPast = slotStart.getTime() < now.getTime();

      timeSlots.push({
        time: slotStart.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        isAvailable: !isOccupied && !isPast,
      });

      tempTime += serviceDuration;
    }

    // CEVAP DÖNGÜDEN SONRA GÖNDERİLİR!
    res.json({
      businessId,
      serviceId,
      date,
      timeSlots,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAppointmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      throw new APIError("Unauthorized", 401);
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: true,
        business: {
          select: {
            name: true,
            workingHours: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ message: "Appointments fetched successfully", appointments });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { appointmentId } = req.params as { appointmentId: string };

    if (!userId) {
      throw new APIError("Unauthorized", 401);
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        userId: userId,
      },
    });

    if (!appointment) {
      throw new APIError("Appointment not found or not owned by the user", 404);
    }

    const now = new Date();
    const startTime = new Date(appointment.startTime);

    const diffInHours =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 2 && diffInHours > 0) {
      throw new APIError(
        "You cannot cancel if there are less than 2 hours until your appointment. Please contact the business.",
        400,
      );
    }

    const udatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment: udatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};
