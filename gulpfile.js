var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    template = require('gulp-template'),
    del = require('del');

vueOptions = {
    "fixed_header": "<nav class=\"navbar fixed-top d-block d-sm-none\">\n" +
        "        <h1 v-cloak>{{json.forename}} {{json.surname}}</h1>\n" +
        "    </nav>\n",
    "header": "<h1 class=\"name\" v-cloak>{{json.forename}} <span class=\"surname\">{{json.surname}}</span></h1>\n" +
        "                <h2 v-cloak>{{json.title}}</h2>\n",
    "contact": "<ul class=\"contact fa-ul\" v-cloak>\n" +
        "                    <li v-for=\"method in json.contact\">\n" +
        "                        <span class=\"fa-li\" v-bind:class=\"[method.icon]\"></span>\n" +
        "                        <a v-if=\"method.url\" v-bind:href=\"method.url\">{{method.description}}</a>\n" +
        "                        <span v-else>\n" +
        "                            {{method.description}}\n" +
        "                        </span>\n" +
        "                    </li>\n" +
        "                </ul>\n",
    "portfolio": "<ul class=\"portfolio list-unstyled text-center d-print-none\" v-cloak>\n" +
        "                    <li v-for=\"link in json.portfolio\">\n" +
        "                        <a class=\"portfolio-link\" v-bind:href=\"link.url\" target=\"_blank\" rel=\"noopener\">\n" +
        "                            <span class=\"fa-2x fa-fw\" v-bind:class=\"[link.icon]\"></span>\n" +
        "                            <div>{{link.description}}</div>\n" +
        "                        </a>\n" +
        "                    </li>\n" +
        "                </ul>\n" +
        "                <ul class=\"portfolio list-unstyled d-none d-print-block ml-0\" v-cloak>\n" +
        "                    <li v-for=\"link in json.portfolio\">\n" +
        "                        <a class=\"portfolio-link\" v-bind:href=\"link.url\" target=\"_blank\" rel=\"noopener\">\n" +
        "                            <span class=\"fa-fw\" v-bind:class=\"[link.icon]\"></span>\n" +
        "                            <span class=\"d-print-none\">{{link.description}}</span>\n" +
        "                        </a>\n" +
        "                    </li>\n" +
        "                </ul>\n",
    "skills": "<ul class=\"skills-list list-unstyled text-center mb-0\" v-cloak>\n" +
        "                    <li v-for=\"skill in json.skills\">\n" +
        "                        <pie-chart :percentage=\"skill.percentage\" :description=\"skill.description\"></pie-chart>\n" +
        "                    </li>\n" +
        "                </ul>\n",
    "address": "<address v-cloak>\n" +
        "                    <span v-for=\"(line, index) in json.address\">\n" +
        "                        {{line}} <span v-if=\"index < json.address.length - 1\">&nbsp;&middot;&nbsp; </span>\n" +
        "                    </span>\n" +
        "                </address>\n",
    "copyright": "{{ new Date().getFullYear() }}",
    "fullName": "{{json.forename}} {{json.surname}}",
    "src_link": "Visit <a v-bind:href=\"json.url\" target=\"_blank\" rel=\"noopener\">\n" +
        "                        <span class=\"fab fa-fw fa-github\"></span>{{json.url}}</a> for source code\n",
    "profile": "<p class=\"profile\" v-cloak>{{ json.profile.title }}</p>\n" +
    "            <ul class=\"pl-0 single-line medium-font mb-4\">\n" +
    "                <li class=\"ml-3\" v-for=\"point in json.profile.points\">{{ point }}</li>\n" +
    "            </ul>\n",
    "education": "<ul class=\"education-qualifications pl-0 single-line small-font mb-4\" v-cloak>\n" +
        "                <li class=\"ml-3\" v-for=\"eq in json.education\">\n" +
        "                    <div class=\"d-flex flex-row\">\n" +
        "                        {{ eq.description }}\n" +
        "                        <time v-if=\"eq.to === undefined\" v-bind:datetime=\"eq.from\">\n" +
        "                            {{ eq.from | monthYear }}\n" +
        "                        </time>\n" +
        "                        <time v-else v-bind:datetime=\"eq.from + '/' + eq.to\">\n" +
        "                            {{ eq.from | monthYear }} &ndash; {{ eq.to | monthYear }}\n" +
        "                        </time>\n" +
        "                    </div>\n" +
        "                </li>\n" +
        "            </ul>\n",
    "experience": "<ul class=\"list-unstyled professional-experience small-font dividers\" v-cloak>\n" +
        "                <li v-for=\"exp in json.experience\">\n" +
        "                    <header class=\"d-flex flex-row\">\n" +
        "                        <h4>{{ exp.company }} <small>{{ exp.title }}</small></h4>\n" +
        "                        <time v-if=\"exp.to === undefined\" v-bind:datetime=\"exp.from\">\n" +
        "                            {{ exp.from | monthYear }} &ndash; Present\n" +
        "                        </time>\n" +
        "                        <time v-else v-bind:datetime=\"exp.from + '/' + exp.to\">\n" +
        "                            {{ exp.from | monthYear }} &ndash; {{ exp.to | monthYear }}\n" +
        "                        </time>\n" +
        "                    </header>\n" +
        "                    <ul class=\"pl-0 mb-3\">\n" +
        "                        <li v-for=\"point in exp.points\">{{ point }}</li>\n" +
        "                    </ul>\n" +
        "                </li>\n" +
        "            </ul>\n",
    "fixed_footer": "<ul class=\"navbar-nav\" v-cloak>\n" +
        "            <li class=\"nav-item\" v-for=\"method in json.contact\" v-if=\"method.footer\">\n" +
        "                <span class=\"fa-fw\" v-bind:class=\"[method.icon]\"></span>\n" +
        "                <a v-if=\"method.url\" v-bind:href=\"method.url\">{{method.description}}</a>\n" +
        "                <span v-else>\n" +
        "                    {{method.description}}\n" +
        "                </span>\n" +
        "            </li>\n" +
        "        </ul>\n",
    "vendor": {
        // development build
        //"src": "https://cdn.jsdelivr.net/npm/vue/dist/vue.js",
        "src": "https://cdn.jsdelivr.net/npm/vue",
        "integrity": "",
        "crossorigin": ""
    },
    "window_test": "Vue",
    "local_script": "js/vendor/vue-2.5.16.min.js",
    "vm_script": "js/main-vue.js"
};

knockoutOptions = {
    "fixed_header": "<h1 data-bind=\"text: fullName\"></h1>",
    "header": "<h1 class=\"name\">\n" +
        "                    <span data-bind=\"text: forename\"></span> <span class=\"surname\" data-bind=\"text: surname\"></span>\n" +
        "                </h1>\n" +
        "                <h2 data-bind=\"text: title\"></h2>\n",
    "contact": "<ul class=\"contact fa-ul\" data-bind=\"foreach: contact\">\n" +
        "                    <li>\n" +
        "                        <span class=\"fa-li\" data-bind=\"css: icon\"></span>\n" +
        "                        <!-- ko if: $data.url -->\n" +
        "                        <a data-bind=\"attr: { 'href': url }, text: description\"></a>\n" +
        "                        <!-- /ko -->\n" +
        "                        <!-- ko ifnot: $data.url -->\n" +
        "                        <span data-bind=\"text: description\"></span>\n" +
        "                        <!-- /ko -->\n" +
        "                    </li>\n" +
        "                </ul>\n",
    "portfolio": "<ul class=\"portfolio list-unstyled text-center d-print-none\" data-bind=\"foreach: portfolio\">\n" +
        "                    <li>\n" +
        "                        <a class=\"portfolio-link\" data-bind=\"attr: { 'href': url }\" target=\"_blank\" rel=\"noopener\">\n" +
        "                            <span class=\"fa-2x fa-fw\" data-bind=\"css: icon\"></span>\n" +
        "                            <div data-bind=\"text: description\"></div>\n" +
        "                        </a>\n" +
        "                    </li>\n" +
        "                </ul>\n" +
        "                <ul class=\"portfolio list-unstyled d-none d-print-block ml-0\" data-bind=\"foreach: portfolio\">\n" +
        "                    <li>\n" +
        "                        <a class=\"portfolio-link\" data-bind=\"attr: { 'href': url }\" target=\"_blank\" rel=\"noopener\">\n" +
        "                            <span class=\"fa-fw\" data-bind=\"css: icon\"></span>\n" +
        "                            <span class=\"d-print-none\" data-bind=\"text: description\"></span>\n" +
        "                        </a>\n" +
        "                    </li>\n" +
        "                </ul>\n",
    "skills": "<ul class=\"skills-list list-unstyled text-center mb-0\" data-bind=\"foreach: skills\">\n" +
        "                    <li>\n" +
        "                        <div data-bind=\"component: {\n" +
        "                                            name: 'pie-chart',\n" +
        "                                            params: {\n" +
        "                                                percentage: percentage,\n" +
        "                                                description: description\n" +
        "                                            }}\"></div>\n" +
        "                    </li>\n" +
        "                </ul>\n",
    "address": "<address data-bind=\"foreach: address\">\n" +
        "                    <span data-bind=\"text: $data\"></span>\n" +
        "                    <!-- ko if: $index() < $parent.address().length - 1 -->\n" +
        "                    &nbsp;&middot;&nbsp;\n" +
        "                    <!-- /ko -->\n" +
        "                </address>\n",
    "copyright": "<span data-bind=\"text: copyrightYear\"></span>",
    "fullName": "<span data-bind=\"text: fullName\"></span>",
    "src_link": "Visit <a data-bind=\"attr: { 'href': url }\" target=\"_blank\" rel=\"noopener\">\n" +
        "<span class=\"fab fa-fw fa-github\"></span><span data-bind=\"text: url\"></span></a> for source code\n",
    "profile": "<!-- ko with: profile --><p class=\"profile\" data-bind=\"text: title\"></p>\n" +
        "            <ul class=\"pl-0 single-line medium-font mb-4\" data-bind=\"foreach: points\">\n" +
        "                <li class=\"ml-3\" data-bind=\"text: $data\"></li>\n" +
        "            </ul><!-- /ko -->\n",
    "education": "<ul class=\"education-qualifications pl-0 single-line small-font\" data-bind=\"foreach: education\">\n" +
        "                <li class=\"ml-3\">\n" +
        "                    <div class=\"d-flex flex-row\">\n" +
        "                        <span data-bind=\"text: description\"></span>\n" +
        "                        <!-- ko if: $data.to === undefined -->\n" +
        "                        <time data-bind=\"attr: { 'datetime': from }, monthYear: from\"></time>\n" +
        "                        <!-- /ko -->\n" +
        "                        <!-- ko ifnot: $data.to === undefined -->\n" +
        "                        <time data-bind=\"attr: { 'datetime': from + '/' + to }\">\n" +
        "                            <span data-bind=\"monthYear: from\"></span> &ndash; <span data-bind=\"monthYear: to\"></span>\n" +
        "                        </time>\n" +
        "                        <!-- /ko -->\n" +
        "                    </div>\n" +
        "                </li>\n" +
        "            </ul>\n",
    "experience": "<ul class=\"list-unstyled professional-experience small-font dividers\" data-bind=\"foreach: experience\">\n" +
        "                <li>\n" +
        "                    <header class=\"d-flex flex-row\">\n" +
        "                        <h4><span data-bind=\"text: company\"></span> <small data-bind=\"text: title\"></small></h4>\n" +
        "                        <!-- ko if: $data.to === undefined -->\n" +
        "                        <time data-bind=\"attr: { 'datetime': from }\"><span data-bind=\"monthYear: from\"></span> &ndash; Present</time>\n" +
        "                        <!-- /ko -->\n" +
        "                        <!-- ko ifnot: $data.to === undefined -->\n" +
        "                        <time data-bind=\"attr: { 'datetime': from + '/' + to }\">\n" +
        "                            <span data-bind=\"monthYear: from\"></span> &ndash; <span data-bind=\"monthYear: to\"></span>\n" +
        "                        </time>\n" +
        "                        <!-- /ko -->\n" +
        "                    </header>\n" +
        "                    <ul class=\"pl-0 mb-3\" data-bind=\"foreach: points\">\n" +
        "                        <li>\n" +
        "                            <span data-bind=\"text: $data\"></span>\n" +
        "                        </li>\n" +
        "                    </ul>\n" +
        "                </li>\n" +
        "            </ul>\n",
    "fixed_footer": "<ul class=\"navbar-nav\" data-bind=\"foreach: contact\">\n" +
        "            <!-- ko if: footer -->\n" +
        "            <li class=\"nav-item\">\n" +
        "                <span class=\"fa-fw\" data-bind=\"css: icon\"></span>\n" +
        "                <!-- ko if: $data.url -->\n" +
        "                <a data-bind=\"attr: { 'href': url }, text: description\"></a>\n" +
        "                <!-- /ko -->\n" +
        "                <!-- ko ifnot: $data.url -->\n" +
        "                <span data-bind=\"text: description\"></span>\n" +
        "                <!-- /ko -->\n" +
        "            </li>\n" +
        "            <!-- /ko -->\n" +
        "        </ul>\n",
    "vendor": {
        "src": "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js",
        "integrity": "sha256-owX7sroiO/O1a7h3a4X29A1g3QgqdNvijRQ7V5TH45M=",
        "crossorigin": "anonymous"
    },
    "window_test": "ko",
    "local_script": "js/vendor/knockout-3.4.2.min.js",
    "vm_script": "js/main-ko.js"
};

gulp.task('vue', function() {
    gulp.src('index.html.tmpl')
        .pipe(template(vueOptions))
        .pipe(rename('vue-test.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('knockout', function() {
    gulp.src('index.html.tmpl')
        .pipe(template(knockoutOptions))
        .pipe(rename('knockout-test.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('less', function () {
    return gulp.src('./less/cv.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function () {
    return gulp.src([
        './favicon.ico',
        './*.html',
        './cv.json',
        './css/**',
        './js/**'
    ],  {base: '.'})
        .pipe(gulp.dest('./dist'));});

gulp.task('default', ['clean'], function() {
    gulp.start('less', 'knockout', 'vue', 'copy');
});
