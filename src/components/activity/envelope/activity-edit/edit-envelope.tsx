'use client';

import {useCoinEnvelopeDetail} from "@/hooks/use-envelope-detail";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import {EditCoinEnvelopeForm} from "./edit-envelop-form";

function EditEnvelopePage({ id }: { id: string }) {
  const { data: envelopeDetail } = useCoinEnvelopeDetail(id);
  const t = useTranslations('activities.envelope.edit');

  if (!envelopeDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative pt-14">
      <style jsx global>
        {`
          body {
            background-color: hsl(var(--muted) / 0.4);
          }
        `}
      </style>
      <div className="fixed left-0 top-0 z-[-1] h-44 w-full bg-gradient-to-b from-[#f0f4fa] to-muted/0"></div>
      <div className="h-full w-full">
        <div className="container mx-auto max-w-5xl space-y-6 overflow-hidden p-6 pt-11 md:flex-row">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
          </div>
           <EditCoinEnvelopeForm envelopeDetail={envelopeDetail} />
        </div>
      </div>
    </div>
  );
}

export default function EditEnvelope({ id }: {id: string}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditEnvelopePage id={id} />
    </Suspense>
  );
}
