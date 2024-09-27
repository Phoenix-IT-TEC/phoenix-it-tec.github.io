
  import userController from '/home/builduser/work/d58756a41851642f/packages/profile-card-tpa-ooi/src/components/ProfileCard/controller.ts';
  import createControllerWrapper from '@wix/yoshi-flow-editor/runtime/esm/pureControllerWrapper.js';

  
import wrapController from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/ooi';


  
var createHttpClient = null;

  

  import { initI18nWithoutICU as initI18n } from '@wix/yoshi-flow-editor/runtime/esm/i18next/init';


  
const multilingualDisabled = false;

  

    var createExperiments = null;
    var createWidgetExperiments = null;
    


  var sentryConfig = {
    DSN: 'https://7108c95b519b4320b1a9d6c4a38570fc@sentry-next.wixpress.com/7859',
    id: 'undefined',
    projectName: 'profile-card-tpa-ooi',
    teamName: 'undefined',
    errorMonitor: true,
  };

  var experimentsConfig = {"scopes":["members-area"],"centralized":true};

  var translationsConfig = {"icuEnabled":false,"defaultTranslationsPath":"/home/builduser/work/d58756a41851642f/packages/profile-card-tpa-ooi/src/assets/locales/messages_en.json","availableLanguages":["ar","bg","ca","cs","da","de","el","en","es","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sk","sl","sv","th","tl","tr","uk","vi","zh","zu"]};

  var biConfig = null;

  var defaultTranslations = {"sign-up.title":"Log In to Connect With Members","sign-up.content":"View and follow other members, leave comments & more.","sign-up.action":"Log In","settings.reset-button-label":"Reset to original design","settings.main-tab":"Main","settings.layout-tab":"Layout","settings.display-tab":"Display","settings.design-tab":"Design","settings.support-tab":"Support","support-tab.links-divider":"Got a question?","support-tab.email-link":"Send Us an Email","support-tab.wix-support-link":"Visit our Help Center","settings.main-tab.customize-profile-button":"Customize","settings.main-tab.customize-profile-message":"Customize the look of your member profile cards.","settings.layout-tab.layout-options":"Layout Options","inner-page.back-button-label":"Back","text-design-page.secondary-label":"Following/followers counters","text-design-page.title-label":"Description","button-design-page.button-style-divider":"Button","button-design-page.button-corner-radius-label":"Corner radius","layout-tab.display-cover-photo":"Show cover","layout-tab.layout-type-label":"Profile picture layout","layout-tab.layout-type-round":"Circle","layout-tab.layout-type-square":"Square","layout-tab.layout-type-none":"None","layout-tab.profile-image-size":"Profile image size","layout-tab.profile-image-size.small":"Small","layout-tab.profile-image-size.medium":"Medium","layout-tab.profile-image-size.large":"Large","layout-tab.profile-widget-size":"Cover image size","layout-tab.profile-widget-size.small":"Small","layout-tab.profile-widget-size.medium":"Medium","layout-tab.profile-widget-size.large":"Large","layout-tab.profile-layout-type-label":"Select layout","layout-tab.full-width":"Full Width","layout-tab.cards":"Cards","layout-tab.align":"Align","layout-tab.align-left":"Left","layout-tab.align-center":"Center","layout-tab.align-right":"Right","display-tab.display-role":"Show role label","design-tab.reset-settings":"Reset design settings to default","backgrounds-and-borders.cover.title":"Cover photo","backgrounds-and-borders.cover.default-color":"Default color","backgrounds-and-borders.cover.show-cover-photo":"Show cover photo","backgrounds-and-borders.cover.show-cover-photo.tooltip":"Let members add a cover image to their profile.","backgrounds-and-borders.cover.photo.default-color":"Cover photo opacity","backgrounds-and-borders.cover.default-photo":"Set default cover photo","backgrounds-and-borders.cover.add-image":"Add Image","backgrounds-and-borders.cover.change-image":"Change Image","backgrounds-and-borders.corner-radius":"Corner radius","settings-tab.allow-users-to-follow":"Show followers/following","settings-tab.allow-users-to-follow.info":"Members can follow others and be followed.","settings-tab.allow-users-to-follow.info.disabled":"Show the following and follower counters as disabled when the follow button is turned off.","settings-tab.show-title":"Show title","settings-tab.show-message-button":"Show Message button","settings-tab.show-message-button.info":"Members can send each other messages directly from their member's card.","settings-tab.show-follow-button":"Show Follow button","settings-tab.show-follow-button.info":"Hide the follow button in all places on this site, including the profile and members pages.","backgrounds-and-borders.title":"Backgrounds and borders","backgrounds-and-borders.box-color":"Background opacity & color","backgrounds-and-borders.border-color-and-opacity":"Border opacity and color","backgrounds-and-borders.border-width":"Background border width","MemberRoles.name.admin":"Admin","MemberRoles.name.blocked":"Blocked","MemberRoles.action_set.blocked":"Mute Member","MemberRoles.action_set_desc.blocked":"Blocked members cannot be part of the community...","MemberRoles.action_unset.blocked":"Unmute Member","MemberRoles.action_set.member_block_member":"Block Member","MemberRoles.action_set_desc.member_block_member":"Blocked members are hidden from the user","MemberRoles.name.forum_moderator":"Forum Moderator","MemberRoles.action_set.forum_moderator":"Set as Forum Moderator","MemberRoles.action_set_desc.forum_moderator":"Moderators can do this: \none thing\nsecond thing...","MemberRoles.action_unset.forum_moderator":"Remove Moderator","MemberRoles.action_set.report":"Report Member","MemberRoles.action_set_desc.report":"An admin will review this member.","MemberRoles.action_set.self":"Share your profile","MemberRoles.action_set_desc.self":"Share your profile URL on Social media","profile-widget.title-placeholder":"Write short description about yourself.","profile-widget.unfollow":"Following","profile-widget.following":"Following","profile-widget.follower":"Follower","profile-widget.followers":"Followers","profile-widget.follow":"Follow","profile-widget.edit":"Edit","profile-widget.view-public-profile":"View Public Profile","profile-widget.cancel":"Cancel","profile-widget.save":"Save","profile-widget.message":"Message","profile-widget.saved-message":"Profile Updated","profile-widget.reposition":"Reposition","profile-widget.drag-to-reposition":"Drag to reposition","profile-widget.done":"Done","profile-widget.change-photo":"Change photo","profile-widget.add-cover-photo.aria-label":"Add cover photo","profile-widget.change-aria-label-photo":"Change cover photo","profile-widget.add-profile-photo.aria-label":"Add profile photo","profile-widget.change-profile-photo":"Change profile photo","profile-widget.private-member":"Private Member","profile-widget.profile-section.aria-label":"profile header, {{member}}","MemberRoles.action_set.edit":"Edit Profile","MemberRoles.action_set_desc.edit":"Edit your profile information","MemberRoles.action_set.join":"Make Profile Public","MemberRoles.action_unset.join":"Make Profile Private","MemberRoles.action_set_desc.join":"Become a part of website community","button-design-page.button-font-label":"Text","settings.non-social-profile-note":"Customize the look of your member profile cards.","design-tab.text-and-button-style":"Text & Button Style","design-tab.text-style":"Text","design-tab.button-style":"Button","text-and-button-design-page.text-label":"Text","profile-widget.my-profile":"Edit Profile","button-design-page.button-opacity-color-label":"Opacity and color","button-design-page.button-border-color-and-opacity":"Border color and opacity","button-design-page.button-border-width":"Border width","text-and-button-design-page.member-name-label":"Member name","MemberRoles.action_set.community":"Make Profile Public","MemberRoles.action_unset.community":"Make Profile Private","MemberRoles.action_set_desc.community":"Become a part of website community","MemberRoles.action_unset_desc.community":"Leave website community","more-button.tooltip":"More actions","MemberRoles.action_unset.report":"Undo Report","MemberRoles.name.blog_writer":"Writer","MemberRoles.action_set.blog_writer":"Set as Writer","MemberRoles.action_unset.blog_writer":"Remove Writer","MemberRoles.name.blog_editor":"Editor","MemberRoles.action_set.blog_editor":"Set as Editor","MemberRoles.action_unset.blog_editor":"Remove Editor","MemberRoles.badge.blocked":"Muted","MemberRoles.blocked.clarify":"Account blocked. For more details, contact the site owner.","MemberRoles.name.deleted":"Deleted","MemberRoles.action_set.deleted":"Delete Member","MemberRoles.action_set_desc.deleted":"Delete member permanently","MemberRoles.name.contact_page":"View Contact","MemberRoles.action_set.contact_page":"View Contact","MemberRoles.action_set_desc.contact_page":"Go to member contact page","MemberRoles.name.wix_expert":"Wix Expert","MemberRoles.action_set.wix_expert":"Set as Wix Expert","MemberRoles.action_set_desc.wix_expert":"Wix Experts are certified Wix users who build websites for other Wix users","MemberRoles.action_unset.wix_expert":"Remove as Wix Expert","MemberRoles.name.wix_code_expert":"Wix Code Expert","MemberRoles.action_set.wix_code_expert":"Set as Wix Code Expert","MemberRoles.action_set_desc.wix_code_expert":"Wix Code Experts are users who answer posts with skills and expertise, providing accurate solutions to difficult problems.","MemberRoles.action_unset.wix_code_expert":"Remove as Wix Code Expert","MemberRoles.name.wix_arena_member":"Wix Marketplace Member","MemberRoles.action_set.wix_arena_member":"Set as Wix Marketplace Member","MemberRoles.action_set_desc.wix_arena_member":"Wix Marketplace Members users with a Wix Marketplace profile","MemberRoles.action_unset.wix_arena_member":"Remove as Wix Marketplace Member","MemberRoles.name.wix_code_forum_ninja":"Wix Code Forum Ninja","MemberRoles.action_set.wix_code_forum_ninja":"Set as Forum Ninja","MemberRoles.action_set_desc.wix_code_forum_ninja":"Forum Ninjas are frequent Wix Code Forum contributors. They answer posted questions, provide sample code and refer users to relevant articles and posts. ","MemberRoles.action_unset.wix_code_forum_ninja":"Remove as Wix Code Forum Ninja","MemberRoles.name.wix_tribe_leader":"Tribe Leader","MemberRoles.action_set.wix_tribe_leader":"Set as Tribe Leader","MemberRoles.action_set_desc.wix_tribe_leader":"Give this Wix Expert a Tribe Leader badge so everyone will know they manage a specific group within the Wix Experts Community.","MemberRoles.action_unset.wix_tribe_leader":"Remove as Tribe Leader","MemberRoles.name.wix_community_champ":"Community Champ","MemberRoles.action_set.wix_community_champ":"Set as Community Champ","MemberRoles.action_set_desc.wix_community_champ":"Give this Wix Expert a Community Champ badge. Others in the community will know this Wix Expert has influence and a specific expertise.","MemberRoles.action_unset.wix_community_champ":"Remove as Community Champ","MemberRoles.name.wix_con_miami":"WixCon Miami 2018","MemberRoles.action_set.wix_con_miami":"Set as WixCon Miami 2018","MemberRoles.action_set_desc.wix_con_miami":"Give this Wix Expert a badge for attending WixCon Miami in 2018.","MemberRoles.action_unset.wix_con_miami":"Remove as WixCon Miami 2018","MemberRoles.name.wix_employee":"Wix Employee","MemberRoles.action_set_desc.wix_employee":"Wix employees","MemberRoles.action_set.wix_employee":"Set as Wix Employee","MemberRoles.action_unset.wix_employee":"Remove as Set Wix Employee","MemberRoles.name.wix_community_manager":"Wix Community Manager","MemberRoles.action_set_desc.wix_community_manager":"Wix community managers","MemberRoles.action_set.wix_community_manager":"Set as Wix Community Manager","MemberRoles.action_unset.wix_community_manager":"Remove as Wix Community Manager","MemberRoles.name.wix_code_master":"Wix Code Master","MemberRoles.action_set_desc.wix_code_master":"Wix code masters","MemberRoles.action_set.wix_code_master":"Set as Wix Code Master","MemberRoles.action_unset.wix_code_master":"Remove as Wix Code Master","MemberRoles.action_set.share_profile":"Share My Profile","MemberRoles.action_set.view_public_profile":"View Public Profile","settings.badges-tab":"Badges","settings.badges-tab.badges-layout":"Layout","settings.badges-tab.choose-a-layout":"Choose a layout","settings.badges-tab.badge-size":"Size","settings.badges-tab.badges-background":"Style","settings.badges-tab.corner-radius":"Corner radius","settings.badges-tab.background":"Background","settings.badges-tab.badges-text":"Text","settings.badges-tab.name-icon":"Name & icon","settings.badges-tab.name-only":"Name","settings.badges-tab.icon-only":"Icon","settings.badges-tab.small":"Small","settings.badges-tab.medium":"Medium","settings.badges-tab.large":"Large","settings.badges-tab.empty.info":"Create and assign badges to members of your site.","settings.badges-tab.empty.learn-more":"Learn more","settings.badges-tab.empty.create-badges":"Create Badges","settings.badges-tab.icon-only-info":"Go to Manage Badges below to make sure all of your badges have an icon.","settings.badges-tab.bottom-info":"To change badge colors, titles or icons go to","settings.badges-tab.manage-badges":"Manage Badges","settings.badges-tab.top-info":"Additional badges may appear for preview purposes only.","settings.main-tab.manage-badges-button":"Manage Badges","settings.main-tab.rate-members-area":"Review Members Area","design-tab.backgrounds-borders":"Backgrounds and borders","badges.manage-badges.popover-action":"Assign Badges","design-tab.title-preview":"Share something about yourself","settings.text-tab":"Text","settings.text-tab.follow-button":"Follow button","settings.text-tab.following-button":"Following button","settings.text-tab.secondary-button":"Secondary button","settings.text-tab.following-counter":"Following counter","settings.text-tab.secondary-followers-counter":"Followers counter","settings.design-tab.button-text-font-size":"Button text font size","profile-widget.edit-details-modal.heading":"Edit your details","profile-widget.edit-details-modal.display-name.label":"Display name","profile-widget.edit-details-modal.error-message.required-field":"Enter your display name.","profile-widget.edit-details-modal.title.label":"Title","profile-widget.edit-details-modal.cancel-button":"Cancel","profile-widget.edit-details-modal.save-button":"Save","profile-widget.toast.display-info-updated":"Your details were updated.","profile-widget.toast.display-info-update-error":"Your details weren't updated due to a technical issue on our end. Try again.","profile-widget.edit-details":"Edit Details"};

  var fedopsConfig = null;

  import { createVisitorBILogger as biLogger } from '/home/builduser/work/d58756a41851642f/packages/profile-card-tpa-ooi/target/generated/bi/createBILogger.ts';

  const controllerOptions = {
    sentryConfig,
    biConfig,
    fedopsConfig,
    experimentsConfig,
    biLogger,
    translationsConfig,
    persistentAcrossPages: false,
    appName: "Profile Card OOI",
    componentName: "ProfileCard",
    appDefinitionId: "14ce28f7-7eb0-3745-22f8-074b0e2401fb",
    componentId: "14cefc05-d163-dbb7-e4ec-cd4f2c4d6ddd",
    projectName: "profile-card-tpa-ooi",
    defaultTranslations,
    multilingualDisabled,
    shouldUseEssentials: true,
    withErrorBoundary: false,
    localeDistPath: "assets/locales"
  };

  const _controller = createControllerWrapper(userController, controllerOptions, {
    initI18n,
    createHttpClient,
    createExperiments,
  });

  export const wrap = wrapController;
  export const descriptor = {
    ...controllerOptions,
    id: controllerOptions.componentId,
    widgetType: "WIDGET_OUT_OF_IFRAME",
    controllerFileName: "/home/builduser/work/d58756a41851642f/packages/profile-card-tpa-ooi/src/components/ProfileCard/controller.ts",
  };

  export const controller = _controller
  export default controller;
