'use strict';

angular.module('Hisbiscus')
  .constant('urls',{
      shows: {
        get: '/shows',
        post: '/shows',
        myshows: '/shows/myshows',
        watch: '/shows/watch',
        remove: '/shows/remove',
        image: '/assests/'
      },
      upload: {
        profilePicture: '/upload'
      },
      profilePicture: {
        get: '/uploads',
        default: '/assests/profile.png'
      },
      available: {
        Netflix: '/assests/netflix.svg.png',
        Hulu: '/assests/hulu.svg.png',
        Aamazon: '/assests/amazon.png'
      },
      comment: {
        get: '/comment/',
        post: '/comment/'
      },
      user: {
        get: '/getprofile',
        signup: 'auth/signup'
      }

});
