'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { CoinEnvelopeItem, EnvelopeItem } from "@/interfaces";
import { useLocale } from "next-intl";

import { useTranslations } from "next-intl";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActivityImageUpload } from '@/hooks/use-activity-image-upload';
import { LoadingButtonStatus } from '@/components/ui/loading-button';

interface FormValues {
    activityName: string;
    startTime: Date;
    endTime: Date;
    coinType: string;
    assetType: 'coin' | 'nft';
    envelopeType: 'random' | 'average';
    nfts: string[];
    totalEnvelope: string;
    totalCoin: string;
    requireTwitterBinding: boolean;
}

export function EditCoinEnvelopeForm({ envelopeDetail }: { envelopeDetail : CoinEnvelopeItem})  {

    const locale = useLocale();
    const t = useTranslations('activities.envelope.edit.form');
    const tCommon = useTranslations('common');
    const tButton = useTranslations('activities.create.button');    
    const [coverImageUrl, setCoverImageUrl] = useState(envelopeDetail.coverImageUrl);
    const [coverImageDialogOpen, setCoverImageDialogOpen] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<LoadingButtonStatus>('idle');

    const formSchema = useMemo(() => {
        const schema = z
          .object({
            activityName: z
              .string()
              .min(1, { message: t('validation.nameRequired') })
              .max(200),
            startTime: z.date(),
            endTime: z.date(),
            coinType: z.string(),
            assetType: z.enum(['coin', 'nft']),
            envelopeType: z.enum(['random', 'average']),
            totalEnvelope: z.union([
              z.literal(''),
              z.string(),
            ]),
            totalCoin: z.union([
              z.literal(''),
              z.string(),
            ]),
            requireTwitterBinding: z.boolean(),
          })
          .refine(
            (data) => {
              return data.endTime > data.startTime;
            },
            {
              message: t('validation.endTimeInvalid'),
              path: ['endTime'],
            }
          );
    
        return schema;
      }, [t]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            activityName: envelopeDetail.name,
            startTime: envelopeDetail.startTime,
            endTime: envelopeDetail.endTime,
            coinType: envelopeDetail.coinType,
            assetType: envelopeDetail.assetType,
            envelopeType: envelopeDetail.envelopeType,
            totalEnvelope: envelopeDetail.totalEnvelope.toString(),
            totalCoin: envelopeDetail.totalCoin.toString(),
            requireTwitterBinding: envelopeDetail.requireTwitterBinding,
        },
    });

    const handleImageUpload = useActivityImageUpload({
        onImageChange: setCoverImageUrl,
        sizeLimit: 100,
        alertMessage: t('imageUpload.sizeLimit'),
    });

    const onSubmit = async (data: FormValues) => {
        if (submitStatus === 'success') {
          return;
        }
    
        data.startTime.setSeconds(0);
        data.startTime.setMilliseconds(0);
        data.endTime.setSeconds(0);
        data.endTime.setMilliseconds(0);
    
        let submitData;
        if (data.assetType === 'nft') {
          const nftType = nftQueryResult.data!.find((n) => data.nfts.includes(n.id))!.type;
          submitData = {
            assetType: 'nft' as const,
            activityName: data.activityName,
            description: '',
            coverImageUrl,
            themeMode: 0,
            colorMode: 0,
            nftType,
            nfts: data.nfts,
            startTime: data.startTime,
            endTime: data.endTime,
          };
        } else if (data.assetType === 'coin') {
          const selectedCoin = coinBalancesResp.data.find((coin) => coin.coinType === data.coinType)!;
          const formattedTotalCoin =
            data.envelopeType === 'random'
              ? BigInt(Number(data.totalCoin) * 10 ** selectedCoin.decimals)
              : BigInt(
                  Number(data.totalCoin) * Number(data.totalEnvelope) * 10 ** selectedCoin.decimals
                );
    
          submitData = {
            assetType: 'coin' as const,
            activityName: data.activityName,
            description: '',
            coverImageUrl,
            themeMode: 0,
            colorMode: 0,
            envelopeType: data.envelopeType,
            coinType: data.coinType,
            totalCoin: formattedTotalCoin.toString(),
            totalEnvelope: data.totalEnvelope,
            startTime: data.startTime,
            endTime: data.endTime,
            requireTwitterBinding: data.requireTwitterBinding,
          };
        }
    
        try {
          console.log('onSubmit', data);
          setSubmitStatus('loading');
          const { id: newEnvelopeId } = await createEnvelope(submitData!);
          setSubmitStatus('success');
          window.setTimeout(() => {
            router.push(`/activities/envelope/manage/${newEnvelopeId}`);
          }, 1000);
        } catch (error) {
          console.error('Error creating envelope', error);
          setSubmitStatus('error');
        }
      };

    return (
        <div>
            <h1>Edit Envelope Activity Form</h1>
        </div>
    )
}
