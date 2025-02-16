"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

interface Theory {
  id: string;
  title: string;
  Theory: { content: string }[];
}

export default function TheoryPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [theory, setTheory] = useState<Theory | null>(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    }
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    async function fetchTheory() {
      try {
        const res = await fetch(`http://localhost:3000/api/topics/${params.id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Не вдалося завантажити тему");
        const data = await res.json();
        setTheory(data);
      } catch (error) {
        console.error("Помилка завантаження теми:", error);
        setTheory(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTheory();
  }, [params]);

  if (loading) return <div>Завантаження...</div>;
  if (!theory) return notFound();

  const { title, Theory: theoryContent } = theory;

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4 text-primary text-center">{title}</h2>

      <div className="space-y-4 w-4/5 mx-auto">
        {theoryContent.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p className="text-gray-700">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <a
          href={`/tasks/${theory.id}`}
          className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
          style={{ height: "100px", width: "300px" }}
        >
          До задач
        </a>
      </div>
    </div>
  );
}
  