'use client';

import { createContext, useContext, useState } from 'react';

export interface StoreContext {
  data?: StoreData;
  updateData: (data?: any) => void;
  clearData: () => void;
}

export interface StoreData {
  selectedPriceId?: string;
  currency?: string;
  userMetaData?: any;
}

const StoreCtx = createContext<StoreContext>({
  updateData: () => {},
  clearData: () => {}
});

const Provider = (props: any) => {
  const [data, setData] = useState<Partial<StoreData>>({
    currency: 'ARS'
  });
  const updateData = (newData: Partial<StoreData>) => {
    if (newData) {
      setData((previous) => ({
        ...previous,
        ...newData
      }));
    }
  };
  const clearData = () => {
    setData({});
  };
  const values = {
    data,
    updateData,
    clearData
  };

  return <StoreCtx.Provider value={values} {...props}></StoreCtx.Provider>;
};

export const useStore = () => {
  return useContext(StoreCtx);
};

export default Provider;
