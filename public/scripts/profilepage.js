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
friendlyPix.ProfilePage = class {

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
      this.profilePage = $('#page-profile');
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
	  this.nbAnimals = $('.fp-user-nbanimals', this.profilePage);
      this.nbAnimalsContainer = $('.fp-user-nbanimals-container', this.profilePage);
      this.animalsContainer = $('.fp-user-animal', this.profilePage);
      this.nextPageButton = $('.fp-next-page-button button');
      this.closeFollowingButton = $('.fp-close-following', this.profilePage);
      this.userInfoPageImageContainer = $('.fp-image-container', this.profilePage);

      // Event bindings.
      this.followCheckbox.change(() => this.onFollowChange());
      this.auth.onAuthStateChanged(() => this.trackFollowStatus());
      this.nbFollowingContainer.click(() => this.displayFollowing());
	  this.nbAnimalsContainer.click(() => this.displayAnimals());
      this.closeFollowingButton.click(() => {
        this.followingContainer.hide();
		this.animalsContainer.hide();
        this.nbFollowingContainer.removeClass('is-active');
		this.nbAnimalsContainer.removeClass('is-active');
      });
    });
  }

  /**
   * Triggered when the user changes the "Follow" checkbox.
   */
  onFollowChange() {
    const checked = this.followCheckbox.prop('checked');
    this.followCheckbox.prop('disabled', true);

    friendlyPix.firebase.toggleFollowUser(this.profileId, checked);
  }

  /**
   * Starts tracking the "Follow" checkbox status.
   */
  trackFollowStatus() {
    if (this.auth.currentUser) {
      friendlyPix.firebase.registerToFollowStatusUpdate(this.profileId, data => {
        this.followCheckbox.prop('checked', data.val() !== null);
        this.followCheckbox.prop('disabled', false);
        this.followLabel.text(data.val() ? 'Following' : 'Follow');
        friendlyPix.MaterialUtils.refreshSwitchState(this.followContainer);
      });
    }
  }

  /**
   * Adds the list of posts to the UI.
   */
  addPosts(posts) {
    const postIds = Object.keys(posts);
    for (let i = postIds.length - 1; i >= 0; i--) {
      this.userInfoPageImageContainer.append(
          friendlyPix.ProfilePage.createImageCard(postIds[i],
              posts[postIds[i]].thumb_url || posts[postIds[i]].url, posts[postIds[i]].text));
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
          this.addPosts(data.entries);
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
  loadProfile(profileId) {
    this.profileId = profileId;

    // Reset the UI.
    this.clear();

    // If users is the currently signed-in user we hide the "Follow" checkbox and the opposite for
    // the "Notifications" checkbox.
    if (this.auth.currentUser && profileId === this.auth.currentUser.uid) {
      this.followContainer.hide();
      friendlyPix.messaging.enableNotificationsContainer.show();
      friendlyPix.messaging.enableNotificationsCheckbox.prop('disabled', true);
      friendlyPix.MaterialUtils.refreshSwitchState(friendlyPix.messaging.enableNotificationsContainer);
      friendlyPix.messaging.trackNotificationsEnabledStatus();
	}
	else {
      friendlyPix.messaging.enableNotificationsContainer.hide();
      this.followContainer.show();
      this.followCheckbox.prop('disabled', true);
      friendlyPix.MaterialUtils.refreshSwitchState(this.followContainer);
      // Start live tracking the state of the "Follow" Checkbox.
      this.trackFollowStatus();
    }

    // Load user's profile.
    friendlyPix.firebase.loadUserProfile(profileId).then(snapshot => {
      const userInfo = snapshot.val();
      if (userInfo) {
        this.userAvatar.css('background-image',
            `url("${userInfo.profile_picture || '/images/silhouette.jpg'}")`);
        this.userUsername.text(userInfo.full_name || 'Anonymous');
        this.userInfoContainer.show();
      } else {
        var data = {
          message: 'This user does not exists.',
          timeout: 5000
        };
        this.toast[0].MaterialSnackbar.showSnackbar(data);
        page(`/feed`);
      }
    });

    // Load user's number of followers.
    friendlyPix.firebase.registerForFollowersCount(profileId,
        nbFollowers => this.nbFollowers.text(nbFollowers));

    // Load user's number of followed users.
    friendlyPix.firebase.registerForFollowingCount(profileId,
        nbFollowed => this.nbFollowing.text(nbFollowed));
		
	// Load user's number of animals.
    friendlyPix.firebase.registerForAnimalsCount(profileId,
        nbAnimals => this.nbAnimals.text(nbAnimals));

    // Load user's number of posts.
    friendlyPix.firebase.registerForPostsCount(profileId,
        nbPosts => this.nbPostsContainer.text(nbPosts));

    // Display user's posts.
    friendlyPix.firebase.getUserFeedPosts(profileId).then(data => {
      const postIds = Object.keys(data.entries);
      if (postIds.length === 0) {
        this.noPosts.show();
      }
      friendlyPix.firebase.subscribeToUserFeed(profileId,
        (postId, postValue) => {
          this.userInfoPageImageContainer.prepend(
              friendlyPix.ProfilePage.createImageCard(postId,
                  postValue.thumb_url || postValue.url, postValue.text));
          this.noPosts.hide();
        }, postIds[postIds.length - 1]);

      // Adds fetched posts and next page button if necessary.
      this.addPosts(data.entries);
      this.toggleNextPageButton(data.nextPage);
    });

    // Listen for posts deletions.
    friendlyPix.firebase.registerForPostsDeletion(postId =>
        $(`.fp-post-${postId}`, this.profilePage).remove());
  }

  /**
   * Displays the list of followed people.
   */
  displayFollowing() {
	// Hide and empty the list of Followed people.
    this.animalsContainer.hide();
    $('.fp-usernamelink', this.animalsContainer).remove();
	this.nbAnimalsContainer.removeClass('is-active');
	
    friendlyPix.firebase.getFollowingProfiles(this.profileId).then(profiles => {
      // Clear previous following list.
      $('.fp-usernamelink', this.followingContainer).remove();
      // Display all following profile cards.
      Object.keys(profiles).forEach(uid => this.followingContainer.prepend(
          friendlyPix.ProfilePage.createProfileCardHtml(
              uid, profiles[uid].profile_picture, profiles[uid].full_name)));
      if (Object.keys(profiles).length > 0) {
        this.followingContainer.show();
        // Mark submenu as active.
        this.nbFollowingContainer.addClass('is-active');
      }
    });
  }
  
   /**
   * Displays the list of animals people.
   */
  displayAnimals() {
	// Hide and empty the list of Followed people.
    this.followingContainer.hide();
    $('.fp-usernamelink', this.followingContainer).remove();
	this.nbFollowingContainer.removeClass('is-active');
	
    friendlyPix.firebase.getAnimalProfiles(this.profileId).then(profiles => {
      // Clear previous following list.
      $('.fp-usernamelink', this.animalsContainer).remove();
      // Display all following profile cards.
      Object.keys(profiles).forEach(uid => this.animalsContainer.prepend(
          friendlyPix.ProfilePage.createProfileCardHtml(
              uid, profiles[uid].profile_picture, profiles[uid].full_name)));
      if (Object.keys(profiles).length > 0) {
        this.animalsContainer.show();
        // Mark submenu as active.
        this.nbAnimalsContainer.addClass('is-active');
      }
    });
  }

  /**
   * Clears the UI and listeners.
   */
  clear() {
    // Removes all pics.
    $('.fp-image', this.userInfoPageImageContainer).remove();

    // Remove active states of sub menu selectors (like "Following").
    $('.is-active', this.userInfoPageImageContainer).removeClass('is-active');

    // Cancel all Firebase listeners.
    friendlyPix.firebase.cancelAllSubscriptions();

    // Hides the "Load Next Page" button.
    this.nextPageButton.hide();

    // Hides the user info box.
    this.userInfoContainer.hide();

    // Hide and empty the list of Followed people.
    this.followingContainer.hide();
    $('.fp-usernamelink', this.followingContainer).remove();
	
	// Hide and empty the list of Followed people.
    this.animalsContainer.hide();
    $('.fp-usernamelink', this.animalsContainer).remove();

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
  
   /**
   * Returns an image Card element for the image with the given URL, used as html button
   */
  static createProfileCardHtmlButton(uid = 0, profilePic = '/images/silhouette.jpg', fullName = 'Anonymous') {
    return `
        <button type="button" class="fp-usernamelink mdl-button mdl-js-button">
            <div class="fp-avatar" style="background-image: url('${profilePic}')"></div>
            <div class="fp-username mdl-color-text--black">${fullName}</div>
        </button>`;
  }

  

  
  
  
};

friendlyPix.profilePage = new friendlyPix.ProfilePage();
