import React from "react";

import ConceptosBasicos from "@/components/education/ConceptosBasicos";
import HistoriaIA from "@/components/education/HistoriaIA";

const Guides = () => {
  return (
    <div className="min-h-full bg-background px-4 pb-24 pt-4 md:px-8 md:pb-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <ConceptosBasicos />
      </div>
    </div>
  );
};

export default Guides;
