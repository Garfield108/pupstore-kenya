window.PupStoreApi = {
  getDogs() {
    return Promise.resolve(window.PupStoreMockData.dogs);
  },
  getDog(id) {
    return Promise.resolve(window.PupStoreMockData.dogs.find((dog) => dog.id === id) || null);
  },
  getProducts() {
    return Promise.resolve(window.PupStoreMockData.products);
  },
  getVets() {
    return Promise.resolve(window.PupStoreMockData.vets);
  }
};
