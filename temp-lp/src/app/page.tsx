"use client";

import { useEffect, useState } from "react";

interface ApiModule {
  id: string;
  title: string;
  description: string;
  docsUrl: string;
  status: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ApiHub() {
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // Hata Çözümü 1: setLoading(true) işlemini burada senkron değil, 
    // fetch başlamadan hemen önce yapıyoruz ama ESLint uyarısı için loading state'ini 
    // fetch mekanizmasıyla yönetmek daha sağlıklıdır.
    
    let isMounted = true;

    fetch(`${apiUrl}/api/discovery?page=${currentPage}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setModules(data.data);
          setPagination(data.pagination);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Discovery error:", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [currentPage]);

  if (loading) {
    return (
      <div className="container" style={{ 
        height: "80vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        textAlign: "center" 
      }}>
        <div className="loader" style={{ 
          border: "4px solid var(--card-bg)", 
          borderTop: "4px solid var(--primary-blue)", 
          borderRadius: "50%", 
          width: "40px", 
          height: "40px", 
          animation: "spin 1s linear infinite",
          marginBottom: "20px"
        }}></div>
        <p style={{ color: "var(--primary-blue)", fontWeight: "500", fontSize: "1.2rem" }}>
          API Hub is waking up...
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "12px", maxWidth: "300px" }}>
          {/* Hata Çözümü 2: it's yerine it&apos;s kullanarak tırnak hatasını giderdik */}
          Note: We are using Render Free Tier. It&apos;s may take up to 30s to spin up the server if it&apos;s idle.
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Api Hub</h1>
        <p>
          {/* Hata Çözümü 2: Özenç's kısmını &apos; ile düzelttik */}
          A modular, multi-service backend environment. Explore Özenç&apos;s specialized
          API systems.
        </p>
      </header>

      <div className="module-list">
        {modules.map((mod) => (
          <a
            key={mod.id}
            href={mod.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="module-card"
          >
            <div className="module-info">
              <h3>
                {mod.title}
                <span className="badge">{mod.status}</span>
              </h3>
              <p>{mod.description}</p>
            </div>

            <div className="explore-link">
              Explore Docs
              <span style={{ fontSize: "1.2rem", marginLeft: "8px" }}>↗</span>
            </div>
          </a>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination-controls" style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          gap: "20px", 
          marginTop: "40px",
          marginBottom: "20px"
        }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="nav-button"
          >
            Previous
          </button>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "500" }}>
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button 
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="nav-button"
          >
            Next
          </button>
        </div>
      )}

      <footer style={{ marginTop: "80px" }}>
        <div style={{ marginBottom: "20px", opacity: 0.7 }}>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            ⚠️ Note: Using Render Free Tier. If the API is idle, the first
            request may take up to 30 seconds to respond.
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "24px",
            fontSize: "0.9rem"
          }}
        >
          Built with Node.js, Next.js & Zod • 2026
          <span
            style={{
              color: "var(--primary-blue)",
              fontWeight: "bold",
              marginLeft: "8px",
              letterSpacing: "1px",
            }}
          >
            ÖZENÇ DÖNMEZER
          </span>
        </div>
      </footer>
    </main>
  );
}