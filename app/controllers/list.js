export default function listController(ListService, AuthService, $location, $routeParams, initialData, $scope ) {//eslint-disable-line
  const listData = ListService.getState();
  if (!listData.selectedlist) {
    ListService.setList($routeParams.id);
  }

  this.lists = listData.lists;
  this.current = listData.selectedList ||
                 this.lists.filter(list => list.id === parseInt($routeParams.id, 10))[0];

  this.foods = this.current.relations.foods;
  this.searchShow = false;
  this.searchLoading = () => ListService.getQueryLoading();

  this.searchResults = [];
  this.cache = true;
  this.lists = initialData.lists;

  this.searchText = '';
  this.listName = '';

  this.filterCompleted = (food) => food._pivot_complete;

  this.toggleSearch = () => {//eslint-disable-line
    this.searchShow = !this.searchShow;//eslint-disable-line
  };

  this.onCompletionChange = (index) => {
    ListService.updateFoodRelations(this.foods[index]);
  };

  this.deleteFood = (id) => ListService.updateList(id)
    .then(() => {
      this.current.relations.foods = this.current.relations.foods.filter(food => food.id !== id);
    });

  this.addFoodItem = (id) => ListService.postFoodItem(id, this.current.id)
    .then((foods) => {
      this.current.relations.foods = foods;
      this.foods = foods;
      this.searchResults = [];
      this.searchText = '';
      this.toggleSearch();
    });

  this.querySearch = (query) => {
    if (query === '') {
      this.searchResults = [];
      return;
    }

    ListService.addQuery(query);
    if (ListService.getQueryLoading()) { return; }

    ListService.setQueryLoading(true);

    ListService.getFoodOptions(ListService.popQuery()).then((foods) => {
      ListService.setQueryLoading(false);
      this.searchResults = foods.data;

      if (ListService.queryStack().length) {
        this.querySearch(ListService.popQuery());
      }
    });
  };
}
