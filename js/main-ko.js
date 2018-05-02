$.getJSON('cv.json', function (data) {

    function CVViewModel() {
        this.forename = ko.observable(data.forename);
        this.surname = ko.observable(data.surname);
        this.fullName = ko.computed(function() {
            return this.forename() + ' ' + this.surname();
        }, this);
        this.title = ko.observable(data.title);
        this.contact = ko.observableArray(data.contact);
        this.portfolio = ko.observableArray(data.portfolio);
        this.skills = ko.observableArray(data.skills);
        this.address = ko.observableArray(data.address);
        this.url = ko.observable(data.url);
        this.profile = ko.observable(data.profile);
        this.education = ko.observableArray(data.education);
        this.experience = ko.observableArray(data.experience);
        this.copyrightYear = ko.observable(new Date().getFullYear());
    }

    var cvVM = new CVViewModel();

    ko.bindingHandlers.monthYear = {
        update: function(element, valueAccessor) {
            var value = valueAccessor(),
                valueUnwrapped = ko.unwrap(value);

            if (!valueUnwrapped) {
                $(element).text('');
            }

            var matches = valueUnwrapped.match(/^([0-9]{4})((?:-)([0-9]{2}))?/);

            if (!matches) {
                $(element).text('');
            }

            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var year = matches[1],
                month = matches[3] === null ? 0 : parseInt(matches[3], 10);

            $(element).text(month ? monthNames[month - 1] + ' ' + year : year);
        }
    };

    ko.bindingHandlers.pieClass = {
        update: function(element, valueAccessor) {
            var value = valueAccessor(),
                valueUnwrapped = ko.unwrap(value);

            if (!valueUnwrapped) {
                return;
            }

            return $(element).addClass('pie-' + valueUnwrapped);
        }
    };

    ko.components.register('pie-chart', {
        viewModel: function(params) {
            this.percentage = ko.observable(params && params.percentage || 0);
            this.description = ko.observable(params && params.description || '');
        },
        template:
            '<figure class="pie-chart">\n' +
                '   <svg viewBox="0 0 32 32">\n' +
            '       <circle r="16" cx="16" cy="16"></circle>\n' +
            '       <circle class="pie" data-bind="pieClass: percentage" r="16" cx="16" cy="16"></circle>\n' +
            '   </svg>\n' +
            '   <figcaption data-bind="text: description"></figcaption>\n' +
            '</figure>\n'
    });

    ko.applyBindings(cvVM);

    document.title = cvVM.fullName() + ' - ' + cvVM.title();
    document.getElementsByTagName('meta')["description"].content = cvVM.fullName() + ' - Curriculum Vitae';
})
.fail(function(jqXHR, textStatus, errorThrown) {
	console.log(errorThrown);
});
