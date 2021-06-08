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
         * ### getFlag
         * @param {String} code 
         * @returns the flag image url
         */
        getFlag(code) {
            let flagUrl = '';
            switch (code) {
                case "en":
                    flagUrl = "https://www.countryflags.io/us/shiny/32.png";
                    break;
                default: 
                    flagUrl = `https://www.countryflags.io/${code}/shiny/32.png`;
                    break;
            }     
            return flagUrl;
        }
    },
    mounted: function() {
        let button = document.querySelector('#search_btn')
        
        button.addEventListener("click", () => {
            let search = document.querySelector('#search_value').value;
            
            axios
            .get(this.moviesUrl + search)
            .then(resp => {
                this.response = resp.data;
                this.moviesRes = this.response.results;
            });
        });
    }
});