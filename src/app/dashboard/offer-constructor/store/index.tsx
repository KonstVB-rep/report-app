import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type DataRow = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  count: number;
  totalPrice: number;
};

export type DataSubSection = {
  id: string;
  name: string;
  rows: DataRow[];
};

export type DataSection = {
  id: string;
  name: string;
  subSections: DataSubSection[];
};

export type DataPart = {
  id: string;
  name: string;
  sections: DataSection[];
};

export type DataOffer = {
  date: Date;
  number: string;
  parts: DataPart[];
};

interface OfferStore {
  dataParts: DataOffer;
  selectedItemId: string;
  setSelectedItemId: (id: string) => void;
  addPart: () => void;
  addSection: (partId: string) => void;
  addSubSection: (partId: string, sectionId: string) => void;
  removePart: (partId: string) => void;
  removeSection: (partId: string, sectionId: string) => void;
  removeSubSection: (partId: string, sectionId: string, subId: string) => void;
  addRow: (partId: string, sectionId: string, subId: string) => void;
  updatePartTitle: (partId: string, value: string) => void;
  updateSectionTitle: (
    partId: string,
    sectionId: string,
    value: string,
  ) => void;
  updateSubSectionTitle: (
    partId: string,
    sectionId: string,
    subId: string,
    value: string,
  ) => void;
  removeRow: (
    partId: string,
    sectionId: string,
    subId: string,
    rowId: string,
  ) => void;
  updateRow: (
    partId: string,
    sectionId: string,
    subId: string,
    rowId: DataRow["id"],
    columnId: keyof DataRow,
    value: any,
  ) => void;
  isReadonly: boolean;
  setReadonly: () => void;
}

const createEmptyRow = (): DataRow => ({
  id: crypto.randomUUID(),
  name: "",
  image: "",
  description: "",
  price: 0,
  count: 0,
  totalPrice: 0,
});

const createEmptySubSection = (): DataSubSection => ({
  id: crypto.randomUUID(),
  name: "",
  rows: [createEmptyRow()], // Сразу со строкой
});

const createEmptySection = (): DataSection => ({
  id: crypto.randomUUID(),
  name: "",
  subSections: [createEmptySubSection()],
});

const createPart = (): DataPart => ({
  id: crypto.randomUUID(),
  name: "",
  sections: [createEmptySection()],
});

export const useOfferStore = create<OfferStore>()(
  immer((set) => ({
    dataParts: {
      date: new Date(),
      number: "",
      parts: [createPart()],
    },
    isReadonly: false,
    setReadonly: () =>
      set((state) => {
        state.isReadonly = state.isReadonly === true ? false : true;
      }),
    selectedItemId: "",
    setSelectedItemId: (id: string) => set({ selectedItemId: id }),

    addPart: () =>
      set((state) => {
        state.dataParts.parts.push(createPart());
      }),
    removePart: (partId: string) =>
      set((state) => {
        state.dataParts.parts = state.dataParts.parts.filter(
          (p) => p.id !== partId,
        );
      }),

    addSection: (partId: string) =>
      set((state) => {
        if (!partId) {
          toast.info("Выберите раздел куда вставить подраздел");
          return;
        }
        const part = state.dataParts.parts.find((p) => p.id === partId);
        if (part) {
          part.sections.push(createEmptySection());
        }
      }),

    addSubSection: (partId, sectionId) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        const section = part?.sections.find((s) => s.id === sectionId);
        if (section) {
          section.subSections.push(createEmptySubSection());
        }
      }),

    addRow: (partId, sectionId, subId) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        const section = part?.sections.find((s) => s.id === sectionId);
        const sub = section?.subSections.find((ss) => ss.id === subId);

        if (sub) {
          sub.rows.push(createEmptyRow());
        }
      }),

    removeSection: (partId, sectionId) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        if (part) {
          part.sections = part.sections.filter((s) => s.id !== sectionId);
        }
      }),

    removeSubSection: (partId, sectionId, subId) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        const section = part?.sections.find((s) => s.id === sectionId);
        if (section) {
          section.subSections = section.subSections.filter(
            (sub) => sub.id !== subId,
          );
        }
      }),

    removeRow: (partId, sectionId, subId, rowId) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        const section = part?.sections.find((s) => s.id === sectionId);
        const sub = section?.subSections.find((ss) => ss.id === subId);

        if (sub) {
          sub.rows = sub.rows.filter((row) => row.id !== rowId);
        }
      }),

    updatePartTitle: (partId: string, value: string) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        if (part) {
          part.name = value;
        }
      }),

    updateSectionTitle: (partId: string, sectionId: string, value: string) =>
      set((state) => {
        state.dataParts.parts.forEach((part) => {
          if (part.id === partId) {
            part.sections.forEach((section) => {
              if (section.id === sectionId) {
                section.name = value;
              }
            });
          }
        });
      }),
    updateSubSectionTitle: (
      partId: string,
      sectionId: string,
      subId: string,
      value: string,
    ) =>
      set((state) => {
        state.dataParts.parts.forEach((part) => {
          if (part.id === partId) {
            part.sections.forEach((section) => {
              if (section.id === sectionId) {
                section.subSections.forEach((sub) => {
                  if (sub.id === subId) {
                    sub.name = value;
                  }
                });
              }
            });
          }
        });
      }),

    updateRow: (
      partId: string,
      sectionId: string,
      subId: string,
      rowId: DataRow["id"],
      columnId: keyof DataRow,
      value: string,
    ) =>
      set((state) => {
        const part = state.dataParts.parts.find((p) => p.id === partId);
        const section = part?.sections.find((s) => s.id === sectionId);
        const sub = section?.subSections.find((ss) => ss.id === subId);

        const row = sub?.rows.find((r) => r.id === rowId);

        if (row) {
          if (columnId === "name" || columnId === "description") {
            row[columnId] = String(value);
          } else if (columnId === "price" || columnId === "count") {
            row[columnId] = Number(value);
            row.totalPrice = Number(row.price) * Number(row.count);
          }
        }
      }),
  })),
);

export const selectParts = (state: OfferStore) => state.dataParts;

export const selectIsReadonly = (state: OfferStore) => state.isReadonly;
export const selectPart = (id: string) =>
  useOfferStore.getState().dataParts.parts.find((p) => p.id === id);

export const setReadonly = () => useOfferStore.getState().setReadonly();

export const selectItemStoreId = (state: OfferStore) => state.selectedItemId;
export const selectItemStoreIdAction = (id: string) =>
  useOfferStore.getState().setSelectedItemId(id);

export const addPart = () => useOfferStore.getState().addPart();
export const addSection = (partId: string) =>
  useOfferStore.getState().addSection(partId);
export const addSubSection = (partId: string, sectionId: string) =>
  useOfferStore.getState().addSubSection(partId, sectionId);
export const addRow = (partId: string, sectionId: string, subId: string) =>
  useOfferStore.getState().addRow(partId, sectionId, subId);
export const removePart = (partId: string) =>
  useOfferStore.getState().removePart(partId);
export const removeSection = (partId: string, sectionId: string) =>
  useOfferStore.getState().removeSection(partId, sectionId);
export const removeSubSection = (
  partId: string,
  sectionId: string,
  subId: string,
) => useOfferStore.getState().removeSubSection(partId, sectionId, subId);
export const removeRow = (
  partId: string,
  sectionId: string,
  subId: string,
  rowId: string,
) => useOfferStore.getState().removeRow(partId, sectionId, subId, rowId);

export const updateRow = (
  partId: string,
  sectionId: string,
  subId: string,
  rowId: string,
  columnId: keyof DataRow,
  value: string,
) =>
  useOfferStore
    .getState()
    .updateRow(partId, sectionId, subId, rowId, columnId, value);

export const updatePartTitle = (partId: string, value: string) =>
  useOfferStore.getState().updatePartTitle(partId, value);
export const updateSectionTitle = (
  partId: string,
  sectionId: string,
  value: string,
) => useOfferStore.getState().updateSectionTitle(partId, sectionId, value);
export const updateSubSectionTitle = (
  partId: string,
  sectionId: string,
  subId: string,
  value: string,
) =>
  useOfferStore
    .getState()
    .updateSubSectionTitle(partId, sectionId, subId, value);
