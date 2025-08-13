// app/listening/[id]/page.tsx
"use client";

import { useSearchParams } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function ListeningPage({ params }: Props) {
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow"); // will be 'full-exam' or null

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Listening Page</h1>
      <p>
        Selected Set ID: <span className="font-semibold">{params.id}</span>
      </p>
      <p>
        Flow: <span className="font-semibold">{flow ?? "one-module"}</span>
      </p>
    </div>
  );
}
