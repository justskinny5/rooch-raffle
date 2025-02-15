import { useRoochClientQuery } from '@roochnetwork/rooch-sdk-kit';
import { formatCoinEnvelopeData, formatEnvelopeData } from '@/utils/envelope';

export const useEnvelopeDetail = (id: string) => {
  return useRoochClientQuery(
    'queryObjectStates',
    {
      filter: {
        object_id: id,
      },
      queryOption: {
        decode: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!id,
      select: (data) => data.data.map(formatEnvelopeData)[0],
    }
  );
};

export const useCoinEnvelopeDetail = (id: string) => {
  return useRoochClientQuery(
    'queryObjectStates',
    {
      filter: {
        object_id: id,
      },
      queryOption: {
        decode: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!id,
      select: (data) => data.data.map(formatCoinEnvelopeData)[0],
    }
  );
};
