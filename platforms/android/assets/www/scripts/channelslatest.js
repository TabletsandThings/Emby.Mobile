define([],function(){function e(e){Dashboard.showLoadingMsg(),Sections.loadLatestChannelItems(e.querySelector(".latestItems"),Dashboard.getCurrentUserId()).then(function(){Dashboard.hideLoadingMsg()},function(){Dashboard.hideLoadingMsg()})}function n(n,a){switch(a){case 0:e(n)}}pageIdOn("pageinit","channelsPage",function(){var e=this,a=e.querySelector(".libraryViewNav");a.addEventListener("tabchange",function(a){n(e,parseInt(a.detail.selectedTabIndex))})})});