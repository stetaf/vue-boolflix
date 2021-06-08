const app = new Vue({
    el: '#app',
    data: {
        querySearch: '',
        moviesUrl: 'https://api.themoviedb.org/3/search/movie?api_key=5eb5e38903b62b2d5616df76724f5b67&language=en-US&page=1&include_adult=false&query=',
        moviesRes: '',
        response: ''
    },
    methods: {
        /**
         * ### Search
         * Make a call to retreive films with the query the user entered
         */
        search() {
            axios
            .get(this.moviesUrl + this.querySearch)
            .then(resp => {
                this.response = resp.data;
                this.moviesRes = this.response.results;
            })
        }
    },
    mounted: function() {

    }
});