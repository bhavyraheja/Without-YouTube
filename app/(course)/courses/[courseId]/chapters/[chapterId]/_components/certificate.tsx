"use client";

import React, { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";

interface CertificateProps {
  userName: string;
  courseTitle: string;
}

const Certificate: React.FC<CertificateProps> = ({ userName, courseTitle }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (!ref.current) return;

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "certificate.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Failed to generate certificate: ", err));
  }, []);

  return (
    <div className="mt-6">
      <div className="h-[400px] w-[560px] relative" ref={ref}>
        <Image
          src="/Certificate.png"
          alt="Certificate Preview"
          width={600}
          height={500}
          className="rounded-md"
        />
        <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">{userName}</h1>
          <p className="text-xl mt-2">{courseTitle}</p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;
