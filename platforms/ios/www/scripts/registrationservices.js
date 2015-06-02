﻿(function () {

    function isAndroid() {

        var platform = (device.platform || '').toLowerCase();

        return platform.indexOf('android') != -1;
    }

    function getPremiumUnlockFeatureId() {

        if (isAndroid()) {
            return "com.mb.android.unlock";
        }

        return 'premiumunlock';
    }

    function validatePlayback(deferred) {

        // Don't require validation on android
        if (isAndroid()) {
            deferred.resolve();
            return;
        }

        validateFeature({

            id: getPremiumUnlockFeatureId()

        }, deferred);
    }

    function validateLiveTV(deferred) {

        validateFeature({

            id: getPremiumUnlockFeatureId()

        }, deferred);
    }

    function getRegistrationInfo(feature, enableSupporterUnlock) {

        if (!enableSupporterUnlock) {
            var deferred = $.Deferred();
            deferred.resolveWith(null, [{}]);
            return deferred.promise();
        }
        return ConnectionManager.getRegistrationInfo(feature, ApiClient);
    }

    function validateFeature(info, deferred) {

        if (IapManager.hasPurchased(info.id)) {
            deferred.resolve();
            return;
        }

        var productInfo = {
            enableSupporterUnlock: isAndroid(),
            enableAppUnlock: IapManager.isPurchaseAvailable(info.id),
            id: info.id
        };

        var prefix = isAndroid() ? 'android' : 'ios';

        // Get supporter status
        getRegistrationInfo(prefix + 'appunlock', productInfo.enableSupporterUnlock).done(function (registrationInfo) {

            if (registrationInfo.IsRegistered) {
                deferred.resolve();
                return;
            }

            showInAppPurchaseInfo(productInfo, registrationInfo, deferred);

        }).fail(function () {
            deferred.reject();
        });
    }

    function getInAppPurchaseElement(info) {

        cancelInAppPurchase();

        var html = '';
        html += '<div class="inAppPurchaseOverlay" style="background-image:url(css/images/splash.jpg);top:0;left:0;right:0;bottom:0;position:fixed;background-position:center center;background-size:100% 100%;background-repeat:no-repeat;z-index:999999;">';
        html += '<div class="inAppPurchaseOverlayInner" style="background:rgba(10,10,10,.8);width:100%;height:100%;color:#eee;">';


        html += '<form class="inAppPurchaseForm" style="margin: 0 auto;padding: 30px 1em 0;">';

        html += '<h1 style="color:#fff;">' + Globalize.translate('HeaderUnlockApp') + '</h1>';

        html += '<p style="margin:2em 0;">';

        if (info.enableSupporterUnlock && info.enableAppUnlock) {
            html += Globalize.translate('MessageUnlockAppWithPurchaseOrSupporter');
        }
        else if (info.enableSupporterUnlock) {
            html += Globalize.translate('MessageUnlockAppWithSupporter');
        } else if (info.enableAppUnlock) {
            html += Globalize.translate('MessageUnlockAppWithPurchase');
        } else {
            html += '<span style="color:red;">';
            html += Globalize.translate('MessagePaymentServicesUnavailable');
            html += '</span>';
        }
        html += '</p>';

        if (info.enableSupporterUnlock) {
            html += '<p style="margin:2em 0;">';
            html += Globalize.translate('MessageToValidateSupporter');
            html += '</p>';
        }

        if (info.enableAppUnlock) {
            html += '<button class="btn btnActionAccent btnAppUnlock" data-role="none" type="submit"><span>' + Globalize.translate('ButtonUnlockWithPurchase') + '</span><i class="fa fa-check"></i></button>';
        }

        if (info.enableSupporterUnlock) {
            html += '<button class="btn btnSignInSupporter" data-role="none" type="button"><span>' + Globalize.translate('ButtonUnlockWithSupporter') + '</span><i class="fa fa-check"></i></button>';
        }

        html += '<button class="btn btnCancel" data-role="none" type="button"><span>' + Globalize.translate('ButtonCancel') + '</span><i class="fa fa-close"></i></button>';

        html += '</form>';

        html += '</div>';
        html += '</div>';

        $(document.body).append(html);

        return $('.inAppPurchaseOverlay');
    }

    function cancelInAppPurchase() {

        $('.inAppPurchaseOverlay').remove();
    }

    var currentDisplayingProductInfo = null;
    var currentDisplayingDeferred = null;

    function clearCurrentDisplayingInfo() {
        currentDisplayingProductInfo = null;
        currentDisplayingDeferred = null;
    }

    function showInAppPurchaseInfo(info, serverRegistrationInfo, deferred) {

        var elem = getInAppPurchaseElement(info);

        currentDisplayingProductInfo = info;
        currentDisplayingDeferred = deferred;

        $('.inAppPurchaseForm', elem).on('submit', function () {

            IapManager.beginPurchase(info.id);
            return false;
        });

        $('.btnCancel', elem).on('click', function () {

            clearCurrentDisplayingInfo();
            cancelInAppPurchase();

            // For testing purposes
            if (!info.enableSupporterUnlock && !info.enableAppUnlock) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });
        $('.btnSignInSupporter', elem).on('click', function () {

            clearCurrentDisplayingInfo();

            Dashboard.alert({
                message: Globalize.translate('MessagePleaseSignInLocalNetwork'),
                callback: function () {
                    cancelInAppPurchase();
                    Dashboard.logout();
                }
            });
        });
    }

    function onProductUpdated(e, product) {

        var currentInfo = currentDisplayingProductInfo;
        var deferred = currentDisplayingDeferred;

        if (currentInfo && deferred) {
            if (product.owned && product.id == currentInfo.id) {

                clearCurrentDisplayingInfo();
                cancelInAppPurchase();
                deferred.resolve();
            }
        }
    }

    window.RegistrationServices = {

        renderPluginInfo: function (page, pkg, pluginSecurityInfo) {


        },

        addRecurringFields: function (page, period) {

        },

        initSupporterForm: function (page) {

            $('.recurringSubscriptionCancellationHelp', page).html('');
        },

        validateFeature: function (name) {
            var deferred = DeferredBuilder.Deferred();

            if (name == 'playback') {
                validatePlayback(deferred);
            } else if (name == 'livetv') {
                validateLiveTV(deferred);
            } else {
                deferred.resolve();
            }

            return deferred.promise();
        }
    };

    function onIapManagerLoaded() {
        Events.on(IapManager, 'productupdated', onProductUpdated);
    }

    if (isAndroid()) {
        requirejs(['thirdparty/cordova/android/iap', onIapManagerLoaded]);
    } else {
        requirejs(['thirdparty/cordova/iap', onIapManagerLoaded]);
    }

})();