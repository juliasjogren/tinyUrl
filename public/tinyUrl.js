new Vue({
  el: "#app",
  data: {
    url: "",
    errorMessage: "",
    urls: []
  },
  mounted() {
    if (localStorage.getItem("urls")) {
      try {
        this.urls = JSON.parse(localStorage.getItem("urls"));
      } catch (e) {
        localStorage.removeItem("urls");
      }
    }
  },
  methods: {
    checkUrl: function(event) {
      event.preventDefault();

      let regexp = /\w\.\w/;
      let checkurl = regexp.test(this.url);

      if (checkurl === true) {
        this.addUrl(this.url);
        this.errorMessage = "";
      } else {
        this.errorMessage =
          "Something went wrong, make sure the input is an URL";
      }
    },
    addUrl: function() {
      fetch("http://localhost:3000/api/addUrl", {
        method: "POST",
        body: JSON.stringify({ url: this.url }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        res.json().then(data => {
          let tinyUrl = "http://localhost:3000/" + data.url;
          const newUrl = {};
          newUrl.url = this.url;
          newUrl.tinyUrl = tinyUrl;
          this.addRow(newUrl);
        });
      });
    },
    addRow: function(newUrl) {
      this.urls.unshift(newUrl);
      if (this.urls.length > 10) {
        this.urls.pop();
      }
      const parsed = JSON.stringify(this.urls);
      localStorage.setItem("urls", parsed);
      this.url = "";
    }
  }
});
