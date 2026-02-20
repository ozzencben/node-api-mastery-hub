import { Request, Response, NextFunction } from "express";
import { APIError } from "../../core/utils/APIError";
import prisma from "../../core/lib/prisma";

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
}

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
  try {    const ownerId = req.headers["x-user-id"] as string;
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
}

// Appointment Controller
export const createAppointmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {} catch (error) {
    next(error);
  }
}
