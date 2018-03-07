/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

window.friendlyPix = window.friendlyPix || {};

/**
 * Handles the User Profile UI.
 */
friendlyPix.MyAnimalsPage = class {

  /**
   * Initializes the user's profile UI.
   * @constructor
   */
  constructor() {
    // Firebase SDK.
    this.database = firebase.database();
    this.auth = firebase.auth();

    $(document).ready(() => {
      // DOM Elements.
      this.profilePage = $('#page-animals');
      this.userAvatar = $('.fp-user-avatar');
      this.toast = $('.mdl-js-snackbar');
      this.userUsername = $('.fp-user-username');
      this.userInfoContainer = $('.fp-user-container');
      this.followContainer = $('.fp-follow');
      this.noPosts = $('.fp-no-posts', this.profilePage);
      this.followLabel = $('.mdl-switch__label', this.followContainer);
      this.followCheckbox = $('#follow');
      this.nbPostsContainer = $('.fp-user-nbposts', this.profilePage);
      this.nbFollowers = $('.fp-user-nbfollowers', this.profilePage);
      this.nbFollowing = $('.fp-user-nbfollowing', this.profilePage);
      this.nbFollowingContainer = $('.fp-user-nbfollowing-container', this.profilePage);
      this.followingContainer = $('.fp-user-following', this.profilePage);
      this.nextPageButton = $('.fp-next-page-button button');
      this.closeFollowingButton = $('.fp-close-following', this.profilePage);
      this.userAnimalContainer = $('.fp-image-container', this.profilePage);

    });
  }




  /**
   * Adds the list of profiles to the UI.
   */
  addProfiles(profiles) {
    const profileIds = Object.keys(profiles);
	console.log("loaded profiles: " + profiles[profileIds[0]].profile_picture);
	console.log(profiles);
    for (let i = profileIds.length - 1; i >= 0; i--) {
      this.userAnimalContainer.append(
          friendlyPix.ProfilePage.createProfileCardHtml(profileIds[i],
              profiles[profileIds[i]].profile_picture, profiles[profileIds[i]].full_name));
      this.noPosts.hide();
    }
  }

  /**
   * Shows the "load next page" button and binds it the `nextPage` callback. If `nextPage` is `null`
   * then the button is hidden.
   */
  toggleNextPageButton(nextPage) {
    if (nextPage) {
      this.nextPageButton.show();
      this.nextPageButton.unbind('click');
      this.nextPageButton.prop('disabled', false);
      this.nextPageButton.click(() => {
        this.nextPageButton.prop('disabled', true);
        nextPage().then(data => {
          this.addProfiles(data.entries);
          this.toggleNextPageButton(data.nextPage);
        });
      });
    } else {
      this.nextPageButton.hide();
    }
  }

  /**
   * Displays the given user information in the UI.
   */
  loadAnimals() {
    // Reset the UI.
    this.clear();

    // Display user's animals.
    friendlyPix.firebase.getUserAnimals(this.auth.currentUser.uid).then(data => {
      const animalIds = Object.keys(data.entries);
      if (animalIds.length === 0) {
        this.noPosts.show();
      }
	  console.log("got user animals: (length " + animalIds.length + ") " + data);
      // Adds fetched posts and next page button if necessary.
      this.addProfiles(data.entries);
      this.toggleNextPageButton(data.nextPage);
    });

  }



  /**
   * Clears the UI and listeners.
   */
  clear() {
    // Removes all pics.
    $('.fp-usernamelink', this.userAnimalContainer).remove();

	console.log("cleared");
	
    // Remove active states of sub menu selectors (like "Following").
    $('.is-active', this.userAnimalContainer).removeClass('is-active');

    // Cancel all Firebase listeners.
    friendlyPix.firebase.cancelAllSubscriptions();

    // Hides the "Load Next Page" button.
    this.nextPageButton.hide();

    // Hides the user info box.
    this.userInfoContainer.hide();

    // Hide and empty the list of Followed people.
    this.followingContainer.hide();
    $('.fp-usernamelink', this.followingContainer).remove();

    // Stops then infinite scrolling listeners.
    friendlyPix.MaterialUtils.stopOnEndScrolls();

    // Hide the "No posts" message.
    this.noPosts.hide();
  }

  /**
   * Returns an image Card element for the image with the given URL.
   */
  static createImageCard(postId, thumbUrl, text) {
    const element = $(`
          <a href="/post/${postId}" class="fp-post-${postId} fp-image mdl-cell mdl-cell--12-col mdl-cell--4-col-tablet
                                            mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">
              <div class="fp-overlay">
                  <i class="material-icons">favorite</i><span class="likes">0</span>
                  <i class="material-icons">mode_comment</i><span class="comments">0</span>
                  <div class="fp-pic-text">${text}</div>
              </div>
              <div class="mdl-card mdl-shadow--2dp mdl-cell
                          mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"></div>
          </a>`);
    // Display the thumbnail.
    $('.mdl-card', element).css('background-image', `url("${thumbUrl.replace(/"/g, '\\"')}")`);
    // Start listening for comments and likes counts.
    friendlyPix.firebase.registerForLikesCount(postId,
        nbLikes => $('.likes', element).text(nbLikes));
    friendlyPix.firebase.registerForCommentsCount(postId,
        nbComments => $('.comments', element).text(nbComments));

    return element;
  }

  /**
   * Returns an image Card element for the image with the given URL.
   */
  static createProfileCardHtml(uid, profilePic = '/images/silhouette.jpg', fullName = 'Anonymous') {
    return `
        <a class="fp-usernamelink mdl-button mdl-js-button" href="/user/${uid}">
            <div class="fp-avatar" style="background-image: url('${profilePic}')"></div>
            <div class="fp-username mdl-color-text--black">${fullName}</div>
        </a>`;
  }
};

friendlyPix.myAnimalsPage = new friendlyPix.MyAnimalsPage();
