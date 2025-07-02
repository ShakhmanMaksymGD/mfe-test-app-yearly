import { defineStore } from 'pinia'

export const useYearlyStore = defineStore('yearly', {
  state: () => ({
    sortBy: [],
  }),
  getters: {
    mappedSortBy: state => {
      const result = state.sortBy.map(item => {
        return `${item.key}, order: ${item.order}`;
      });

      return result;
    },
  },
  actions: {
    setSortBy(data) {
      this.sortBy = data;
    },
  },
});