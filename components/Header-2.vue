<template>
	<header class="header header-megamenu">
		<nav class="navbar navbar-default" role="navigation">
			<div class="container">
				<div class="search-bar">
					<input type="search" placeholder="Type search text here...">
					<div class="search-close"><i class="fa fa-times"></i></div>
				</div>
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="./index.html"><img src="/assets/images/logo.png" class="img-responsive" alt=""/></a>
				</div>
				
				<div class="search-trigger pull-right"></div>

				<div class="login pull-right"></div>
				
				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse navbar-ex1-collapse">
					<ul class="nav navbar-nav">
                        <li class="dropdown megamenu" v-for="(testament, index) in testaments" :key="index">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            {{ testament }} <span class="fa fa-angle-down"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                            <div class="row">
                                <div
                                class="col-md-3"
                                v-for="(book, idx) in booksByTestament(testament)"
                                :key="idx"
                                >
                                <NuxtLink
                                    v-if="postsByBook(book.id).length > 0"
                                    :to="`/book/${book.id}`"
                                    class="enabled-link"
                                >
                                    <h5>{{ book.name }}</h5>
                            </NuxtLink>
                                <NuxtLink v-else class="disabled-link">
                                    <h5>{{ book.name }}</h5>
                                </NuxtLink>
                                </div>
                            </div>
                            </li>
                        </ul>
                        </li>

						<li class="dropdown megamenu">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">About<span class="fa fa-angle-down"></span></a>
						</li>
						<!-- <li class="dropdown megamenu">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Travel <span class="fa fa-angle-down"></span></a>
							<ul class="dropdown-menu">
								<li>
									<div class="row">
										<div class="col-md-3">
											<h5>Celebrity Life</h5>
											<a href="#">Celebrities Gone Bad</a>
											<a href="#">Hook Ups & Break Ups</a>
											<a href="#">Celebrity Selfies</a>
											<a href="#">Celebrity Kids</a>
											<a href="#">Royals</a>
										</div>
										
										<div class="col-md-3">
											<h5>TV & Radio</h5>
											<a href="#">TV Shows</a>
											<a href="#">Reality TV</a>
											<a href="#">TV Ratings</a>
											<a href="#">Radio</a>
											<a href="#">Morning Shows</a>
											<a href="#">Current Affairs</a>
											<a href="#">Flashbacks</a>
										</div>
										
										<div class="col-md-3">
											<h5>Movies</h5>
											<a href="#">New Movies</a>
											<a href="#">Movie Trailers</a>
											<a href="#">Upcoming Movies</a>
											<a href="#">Box Office</a>
										</div>
										
										<div class="col-md-3">
											<h5>Music</h5>
											<a href="#">Music Videos</a>
											<a href="#">Music Festivals</a>
											<a href="#" class="last">Tours</a>
											
											<h5>Awards</h5>
											<a href="#">Oscars</a>
											<a href="#">MTV</a>
											<a href="#">Emmys</a>
										</div>
										
										<div class="col-md-3">
											<h5>Books</h5>
											<a href="#">Books</a>
											<a href="#">Magazines</a>
											
											<h5>Celebrity Style</h5>
											<a href="#">Red Carpet</a>
											<a href="#">Wardrobe Malfunction</a>
										</div>										
									</div>
								</li>
							</ul>	
						</li> -->
						<!-- <li class="dropdown megamenu">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Entertainment <span class="fa fa-angle-down"></span></a>
							<ul class="dropdown-menu">
								<li>
									<div class="row">
										<div class="col-md-3">
											<h5>Celebrity Life</h5>
											<a href="#">Celebrities Gone Bad</a>
											<a href="#">Hook Ups & Break Ups</a>
											<a href="#">Celebrity Selfies</a>
											<a href="#">Celebrity Kids</a>
											<a href="#">Royals</a>
										</div>
										
										<div class="col-md-3">
											<h5>TV & Radio</h5>
											<a href="#">TV Shows</a>
											<a href="#">Reality TV</a>
											<a href="#">TV Ratings</a>
											<a href="#">Radio</a>
											<a href="#">Morning Shows</a>
											<a href="#">Current Affairs</a>
											<a href="#">Flashbacks</a>
										</div>
										
										<div class="col-md-3">
											<h5>Movies</h5>
											<a href="#">New Movies</a>
											<a href="#">Movie Trailers</a>
											<a href="#">Upcoming Movies</a>
											<a href="#">Box Office</a>
										</div>
										
										<div class="col-md-3">
											<h5>Music</h5>
											<a href="#">Music Videos</a>
											<a href="#">Music Festivals</a>
											<a href="#" class="last">Tours</a>
											
											<h5>Awards</h5>
											<a href="#">Oscars</a>
											<a href="#">MTV</a>
											<a href="#">Emmys</a>
										</div>
										
										<div class="col-md-3">
											<h5>Books</h5>
											<a href="#">Books</a>
											<a href="#">Magazines</a>
											
											<h5>Celebrity Style</h5>
											<a href="#">Red Carpet</a>
											<a href="#">Wardrobe Malfunction</a>
										</div>										
									</div>
								</li>
							</ul>	
						</li> -->
						<!-- <li class="dropdown megamenu">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Technology <span class="fa fa-angle-down"></span></a>
							<ul class="dropdown-menu">
								<li>
									<div class="row">
										<div class="col-md-3">
											<h5>Celebrity Life</h5>
											<a href="#">Celebrities Gone Bad</a>
											<a href="#">Hook Ups & Break Ups</a>
											<a href="#">Celebrity Selfies</a>
											<a href="#">Celebrity Kids</a>
											<a href="#">Royals</a>
										</div>
										
										<div class="col-md-3">
											<h5>TV & Radio</h5>
											<a href="#">TV Shows</a>
											<a href="#">Reality TV</a>
											<a href="#">TV Ratings</a>
											<a href="#">Radio</a>
											<a href="#">Morning Shows</a>
											<a href="#">Current Affairs</a>
											<a href="#">Flashbacks</a>
										</div>
										
										<div class="col-md-3">
											<h5>Movies</h5>
											<a href="#">New Movies</a>
											<a href="#">Movie Trailers</a>
											<a href="#">Upcoming Movies</a>
											<a href="#">Box Office</a>
										</div>
										
										<div class="col-md-3">
											<h5>Music</h5>
											<a href="#">Music Videos</a>
											<a href="#">Music Festivals</a>
											<a href="#" class="last">Tours</a>
											
											<h5>Awards</h5>
											<a href="#">Oscars</a>
											<a href="#">MTV</a>
											<a href="#">Emmys</a>
										</div>
										
										<div class="col-md-3">
											<h5>Books</h5>
											<a href="#">Books</a>
											<a href="#">Magazines</a>
											
											<h5>Celebrity Style</h5>
											<a href="#">Red Carpet</a>
											<a href="#">Wardrobe Malfunction</a>
										</div>										
									</div>
								</li>
							</ul>	
						</li> -->
					</ul>
				</div>
				<!-- /.navbar-collapse -->
			</div>
		</nav>
	</header>	

</template>
<script setup>
import { computed } from "vue";
import { usePostsStore } from "@/stores/posts";

// Access the Pinia store
const postsStore = usePostsStore();

// Fetch books and posts
await postsStore.fetchBooksAndTestaments();
await postsStore.fetchPosts(); // Ensure posts are fetched

// Reactive properties for books and testaments
const books = computed(() => postsStore.books);
const testaments = computed(() => postsStore.testaments);

// Computed property for books by testament
const booksByTestament = computed(() => {
  return (testament) => books.value.filter((book) => book.testament === testament);
});

// Computed property for posts associated with a book
const postsByBook = (bookId) => {
  return postsStore.posts.filter((post) => post.book_id === bookId);
};
</script>

<!-- <script setup>
import { computed, onMounted } from 'vue';
import { usePostsStore } from '@/stores/posts'; 

const postsStore = usePostsStore();

onMounted(async () => {
  await postsStore.fetchBooksAndTestaments();
});

const testaments = computed(() => postsStore.testaments);
const books = computed(() => postsStore.books);
</script> -->

<style lang="css" scoped>

.container {
	max-width: 1200px;
	width: 100%;
	margin: 0 auto;
}

.enabled-link {
  /* text-decoration: underline; */
  border: 1px solid var(--header-color);
  background-color: var(--header-color);
  color: var(--first-color-lighten) !important;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.enabled-link h5{
  color: var(--first-color-lighten) !important;
}

.disabled-link {
  text-decoration: none;
  color: grey;
  cursor: not-allowed;
}

/* =============================
   2. HEADER STYLES
================================ */

.header {
	height: 101px;
	background-color: #fff;
	border-bottom: 1px solid #eee;
}

.header .container {
	position: relative;
}

.header .navbar-default {
	border: none;
	border-radius: 0px;
	background: transparent;
	margin: 0;
}

.header .navbar-header {
	float: left;
	margin: 0;
	width: 270px;
}

.header .navbar-brand {
	height: 101px;
	padding: 33px 15px;
	font-size: 18px;
	line-height: 20px;
}

.header .navbar-nav > li > a:hover {
	background:transparent !important;
}

.header .navbar-default .navbar-nav > li > a {
	color: #333;
	padding: 39px 12.6px;
	font-size: 16px;
	letter-spacing: -0.010em;
	background:transparent !important;
}

.header .navbar-default .navbar-nav > li > a:hover {
	color: #2ec5f0;
}

.header .navbar-default .navbar-nav > li > a > span {
    margin-left: 2px;
    font-size: 14px;
}

.navbar {
    position: relative;
    min-height: 50px;
    margin-bottom: 20px;
    border: 1px solid transparent;
}

.header-list {
	background:#f8f8f8;
}

.header-list header {
	margin-bottom:25px;
}

.header2 .navbar-header {
    width: 180px;
}

.navbar-social {
	float:left;
    width: 225px;
}

.navbar-social a {
    float: left;
    margin-right: 20px;
    height: 100px;
    padding-top: 41px;
}

.header3 .logo {
    margin: 0 25px;
    margin-top: -4px;
}

.nav-trigger {
    width: 18px;
    height: 100px;
    float: left;
    padding-top: 43px;
    margin-right: 30px;
	cursor:pointer;
}

.nav-trigger span {
	height:1px;
	width:18px;
	margin-bottom:6px;
	background:#222222;
	display:block;
	transition:.4s;
	-webkit-transition:.4s;
	-moz-transition:.4s;
}

.navbar-toggle {
    position: relative;
    float: right;
    padding: 9px 10px;
    margin-top: 8px;
    margin-right: 15px;
    margin-bottom: 8px;
    background-color: transparent;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

.sidemenu-active .nav-trigger span:first-child {
    transform: rotate(45deg);
    position: relative;
    top: 7px;
}

.sidemenu-active .nav-trigger span:nth-child(2) {
    transform: rotate(-45deg);
}

.sidemenu-active .nav-trigger span:last-child {
display:none;
}

.log-reg {
    margin: 29px 0 0 55px;
}

.log-reg a {
	margin-left:8px;
	border:1px solid #e5e5e5;
	line-height:35px;
	padding:0 20px;
	border-radius:5px;
	display:inline-block;
	color:#222222;
	font-size:11px;
	font-weight:bold;
	letter-spacing:0.06em;
	text-transform:uppercase;
}

.log-reg a:last-child {
	border:1px solid #2ec5f0;
	background:#2ec5f0;
	color:#fff;
}

.log-reg a:hover {
	border:1px solid #222;
	background:#222;
	color:#fff;
}

.header4 .navbar-header {
    width: 195px;
}

.search-alt {
    border: 1px solid #e5e5e5;
    height: 35px;
    width: 300px;
    border-radius: 5px;
    margin: 33px 0 0;
	position:relative;
}

.search-alt input {
    width: 100%;
    height: 34px;
    border: none;
    background: transparent;
    padding: 0 30px 0 10px;
}

.search-alt button {
	background: url(/assets/images/icon/1.png) no-repeat center;
	width: 16px;
	height: 16px;
	padding: 0;
	border: none;
	position: absolute;
	top: 9px;
	right: 10px;
	opacity:0.6;
}

.nav-dark {
    height: 47px;
    background: #1e2022;
}

.nav-dark .navbar-nav > li > a {
	padding-top: 13px;
	padding-bottom: 13px;
	color: #dddddd;
	background:transparent !important;
}

.nav-dark .navbar-nav > li > a:hover {
	color: #2ec5f0;
}

.nav-white .navbar-nav > li > a span ,
.nav-dark .navbar-nav > li > a span {
	margin-left:4px;
	font-size:14px;
}

.header5 .navbar-nav {
    float: left;
    margin: 0 -30px;
}

.header5 .navbar-social {
    float: left;
    width: auto;
}

.header5 .navbar-social a {
	opacity:0.7;
}

.header5 .navbar-social a:hover {
	opacity:1;
}

.header5 .navbar-social a {
    height: 46px;
    padding-top: 13px;
}

.header5 {
    height: auto;
    border: none;
}

.header5 .nav-white {
	border-top:1px solid #eeeeee;
    border-bottom: 1px solid #eee;
}

.header6 .navbar-social a {
	height: 100px;
	padding-top: 41px;
}

.header6 .navbar-nav {
    float: none;
    margin: 0 auto;
    display: table;
}

.header6 .navbar-brand {
    margin: 0;
    float: left;
    display: table;
    position: relative;
    left: 50%;
    transform: translateX(-100%);
}

.dropdown-v1 > .dropdown-menu {
	position: absolute;
	top: 80px;
	left: 0;
	z-index: 1000;
	float: left;
	min-width: 200px;
	padding: 0;
	margin: 0;
	font-size: 14px;
	background-color: #fff;
	border: none;
	border-radius: 0px;
	-webkit-box-shadow: 0 5px 10px rgba(24,24,24,.1);
	-moz-box-shadow: 0 5px 10px rgba(24,24,24,.1);
	box-shadow: 0 5px 10px rgba(24,24,24,.1);
	border-top: 1px solid #2ec5f0;
	transition: .4s;
	-webkit-transition: .4s;
	-moz-transition: .4s;
	opacity: 1;
	/* visibility: hidden; */
}

.dropdown-v1:hover > .dropdown-menu {
	top: 100%;
	opacity: 1;
	visibility: visible;
	transition: .4s;
	-webkit-transition: .4s;
	-moz-transition: .4s;
}

.dropdown-v1 > .dropdown-menu .dropdown-menu {
	position: absolute;
	top: auto;
	left: 105%;
	z-index: 1000;
	display: block !important;
	float: left;
	min-width: 200px;
	padding: 0;
	margin: -40px 0 0;
	font-size: 14px;
	background-color: #fff;
	border: none;
	border-radius: 0px;
	-webkit-box-shadow: 0 5px 10px rgba(24,24,24,.1);
	-moz-box-shadow: 0 5px 10px rgba(24,24,24,.1);
	box-shadow: 0 5px 10px rgba(24,24,24,.1);
	border-top: 1px solid #2ec5f0;
	transition: .4s;
	-webkit-transition: .4s;
	-moz-transition: .4s;
	opacity: 0;
	visibility: hidden;
}

.dropdown-v1 > .dropdown-menu li:hover .dropdown-menu {
	left: 100%;
	opacity: 1;
	visibility: visible;
	transition: .4s;
	-webkit-transition: .4s;
	-moz-transition: .4s;
}

.dropdown-v1 .dropdown-menu > li > a {
    display: block;
    padding: 0px 14px;
    clear: both;
    font-weight: 400;
    line-height: 38px;
    white-space: nowrap;
    font-size: 15px;
    color: #5f6165;
    border-bottom: 1px solid #eeeeee;
}

.dropdown-parent:hover > a ,
.dropdown-parent > a:hover ,
.dropdown-v1 .dropdown-menu>li>a:hover {
	color: #2ec5f0 !important;
	background:transparent;
}

.dropdown-v1 .dropdown-menu > li:last-child > a {
    border-bottom: none;
}

.dropdown-parent > a {
	position:relative;
}

.dropdown-parent > a::after {
    content: "\f105";
    font-family: FontAwesome;
    position: absolute;
    right: 12px;
}

.dropdown-parent > a:hover:after ,
.dropdown-parent:hover > a::after {
    content: "\f107";
    font-family: FontAwesome;
    position: absolute;
    right: 12px;
}

.dropdown-v1 {
	position:relative !important;
}

.header-megamenu .navbar-nav > li {
    position: static;
}

.header-megamenu #navbar {
	position: relative;
}

.megamenu > .dropdown-menu {
	position: absolute;
	top: 130px;
	left: 0;
	z-index: 1000;
	float: left;
	min-width: 100%;
	padding: 30px 30px 22px;
	margin: 0px 0 0;
	font-size: 14px;
	background-color: var(--first-color-lighten);
	border: none;
	border-radius: 0px;
	box-shadow: 0 5px 10px rgba(24,24,24,.1);
	border-top: 1px solid var(--first-color);
	transition: .4s;
	-webkit-transition: .4s;
	-moz-transition: .4s;
	opacity: 0;
	visibility: hidden;
}

@media only screen and (min-width: 768px) and (max-width: 4000px) {

.dropdown-v1 > .dropdown-menu {
	display: block !important;
}

.megamenu > .dropdown-menu {
	display: block !important;
}

}

@media only screen and (min-width: 250px) and (max-width: 767px) {

header.header4 .navbar-header {
    width: calc(100% - 55px);
}

.nav-dark .navbar-nav > li > a {
    color: #666;
}

.dropdown-v1 > .dropdown-menu .dropdown-menu {
    opacity: 1;
    visibility: visible;
    position: relative;
    height: auto;
    left: 0;
    top: 0;
    margin: 0;
    width: 100%;
    border: none;
    box-shadow: none;
    border-bottom: 1px solid #eeeeee;
    padding-left: 0;
}

.dropdown-v1 > .dropdown-menu .dropdown-menu li a {
padding:5px 15px 5px 40px;
}

.megamenu > .dropdown-menu h5 {
    margin: 5px 0 15px;
}

.megamenu > .dropdown-menu {
    padding: 10px;	
}

}

.megamenu:hover .dropdown-menu {
	top: 100px;
	opacity: 1;
	visibility: visible;
	transition: .4s;
	-webkit-transition: .4s;
	-moz-transition: .4s;
}

.megamenu .dropdown-menu .col-md-3 {
    width: 20%;
    float: left;
    display: flex;
    height: 2rem;
    align-items: center;
    margin-bottom: 1rem;
}

.megamenu > .dropdown-menu h5 {
	color: #222222;
	font-size: 12px;
	font-weight: bold;
	margin: 0 0 7px;
	letter-spacing:0.08em;
	text-transform:uppercase;
	padding:0 15px;
}

.megamenu > .dropdown-menu p {
	color: #666;
	line-height: 22px;
}

/* .megamenu > .dropdown-menu a {
	font-size: 15px;
	display: table;
	width: 100%;
	margin-bottom: 0;
	color: #222222;
	border-bottom: 1px solid #eeeeee;
	line-height: 36px;
	padding: 0 15px;
} */

.megamenu > .dropdown-menu a.last ,
.megamenu > .dropdown-menu a:last-child {
	border-bottom: none;
}

.megamenu > .dropdown-menu a.last {
	margin-bottom:25px;
}

.megamenu > .dropdown-menu a:hover {
	color: #2ec5f0;
}

.megamenu {
	position: static;
}

.megamenu > .dropdown-menu .header-post a {
	margin-bottom: 0;
	line-height: 20px;
	padding: 0;
	font-size:16px;
}

.hp-thumb {
	position:relative;
}

.hp-overlay {
	position:absolute;
	height:100%;
	width:100%;
	background:rgba(0,0,0,0.2);
	top:0;
	left:0;
	right:0;
}

.hp-overlay span {
	font-size: 10px;
	letter-spacing: 0.020em;
	line-height: 15px;
	background: rgba(0,0,0,0.5);
	color: #fff;
	padding: 0 5px;
	border-radius: 2px;
	position: absolute;
	bottom: 10px;
	right: 10px;
}

.hp-overlay img {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
}


.megamenu > .dropdown-menu .header-post date {
	font-size: 14px;
	color: #787878;
	line-height: 18px;
	margin: 7px 0 4px;
	display: block;
}

.megamenu > .dropdown-menu .header-post p {
    line-height: 20px;
    font-size: 14px;
    color: #707070;
    margin: 10px 0 10px;
}

.img-full {
	width:100%;
}

.tabs-menu li.current {
    position: relative;
    background-color: #fff;
    border-bottom: 1px solid #fff;
    z-index: 5;
}

.tabs-menu li a {
    padding: 0 40px !important;
	line-height:37px;
	border-bottom:1px solid transparent !important;
}

.tabs-menu .current a {
    color: #2ec5f0;
	background:#fff;
	border-bottom:1px solid #eeeeee !important;
}

.tab-contents {
    display: none;
}

#tab-1 {
 display: block;   
}

.menu-tabs .col-md-3,
.tab-contents .col-md-3 {
    width: 25% !important;
}

.menu-tabs.megamenu > .dropdown-menu {
	padding:0;
	overflow:hidden;
}


.body-overlay {
	z-index: 111;
	background: rgba(0,0,0,0);
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	transition:.4s;
	opacity:0;
	visibility:hidden;
}

.sidemenu-active .body-overlay {
	opacity:1;
	visibility:visible;
	transition:.4s;
}

#sidebar-wrapper {
	position: fixed;
	width: 260px;
	z-index: 11111;
	left: -320px;
	top: 0;
	height: 100%;
	background: #1e2022;
	padding:30px 20px;
	-webkit-box-shadow: 0 0 50px rgba(0,0,0,.5);
	-moz-box-shadow: 0 0 50px rgba(0,0,0,.5);
	box-shadow: 0 0 50px rgba(0,0,0,.5);	
	-webkit-transition: all 0.5s ease;
	-moz-transition: all 0.5s ease;
	-o-transition: all 0.5s ease;
	transition: all 0.5s ease;
}

#sidebar-wrapper.active {
	left: 0;
	-webkit-transition: all 0.5s ease;
	-moz-transition: all 0.5s ease;
	-o-transition: all 0.5s ease;
	transition: all 0.5s ease;
}

#sidebar-wrapper .navbar-nav > li {
    width: 100%;
	display:table;
}

#sidebar-wrapper .navbar-nav > li > a {
    padding: 0;
    line-height: 42px;
    border-bottom: 1px solid #2e3032;
    color: #fff;
	background:transparent !important;
	position:relative;
}

#sidebar-wrapper .navbar-nav > li > a .fa-angle-right::before {
    content: "\f107";
}

#sidebar-wrapper .navbar-nav > li.open > a .fa-angle-right::before ,
#sidebar-wrapper .navbar-nav > li > a:hover .fa-angle-right::before {
    content: "\f106";
}

#sidebar-wrapper .navbar-nav > li > a span {
    position: absolute;
    right: 0;
    line-height: 42px;
    color: #747474;
    font-size: 14px;
}

#sidebar-wrapper .navbar-nav > li > .dropdown-menu {
	margin-top: 0;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	position: relative;
	border-radius: 0px;
	padding: 0;
	background: transparent;
	box-shadow: none;
	border: none;
	width:100%;
}

#sidebar-wrapper .navbar-nav > li > .dropdown-menu > li > a {
    padding: 0 15px !important;
    line-height: 42px;
    border-bottom: 1px solid #2e3032;
    color: #747474;
	font-size:14px;
	background:#222426 !important;
	position:relative;
}

#sidebar-wrapper .search-alt {
    border: none;
    height: 35px;
    width: 100%;
    border-radius: 5px;
    margin: 0 0 35px;
    position: relative;
    background: #303133;
}

#sidebar-wrapper .search-alt button {
	background: url(../img/icon/9.png) no-repeat center;
	opacity: 1;
}

body {
    position: relative;
	transition:.4s;
    left: 0px;
}

.sidemenu-active {
    position: relative;
    transition: .4s;
    left: 260px;
}

.pull-right {
    float: right !important;
}

@media (min-width: 768px) {
    .navbar-toggle {
        display: none;
    }
}
</style>