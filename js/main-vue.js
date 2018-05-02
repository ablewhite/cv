$.getJSON('cv.json', function (data) {

    Vue.filter('monthYear', function (value) {

        if (!value) {
            return '';
        }

        var matches = value.match(/^([0-9]{4})((?:-)([0-9]{2}))?/);

        if (!matches) {
            return '';
        }

        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        var year = matches[1],
            month = matches[3] === null ? 0 : parseInt(matches[3], 10);

        return month ? monthNames[month - 1] + ' ' + year : year;
    });

    Vue.filter('pieClass', function (percentage) {

        if (!percentage) {
            return '';
        }

        return 'pie-' + percentage;
    });

    var PieChart = Vue.extend({
        props: ['percentage', 'description'],
        computed: {
            percentageClass: {
                get: function() {
                    return this.$options.filters.pieClass(this.percentage);
                },
                set: function(percentage) {
                    this.percentage = percentage;
                }
            }
        },
        template:
            '<figure class="pie-chart">\n' +
            '   <svg viewBox="0 0 32 32">\n' +
            '       <circle r="16" cx="16" cy="16"></circle>\n' +
            '       <circle class="pie" v-bind:class="[percentageClass]" r="16" cx="16" cy="16"></circle>\n' +
            '   </svg>\n' +
            '   <figcaption>{{description}}</figcaption>\n' +
            '</figure>\n'
    });

    Vue.component('pie-chart', PieChart);

    var app = new Vue({
        el: '#app',
        data: {
            json: data
        },
        computed: {
            fullName: function () {
                return this.json.forename + ' ' + this.json.surname;
            }
        },
        mounted: function () {
            document.title = this.fullName + ' - ' + data.title;
            document.getElementsByTagName('meta')["description"].content = this.fullName + ' - Curriculum Vitae';
        }
    });

})
.fail(function(jqXHR, textStatus, errorThrown) {
	console.log(errorThrown);
});
