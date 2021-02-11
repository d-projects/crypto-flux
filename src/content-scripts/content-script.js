chrome.runtime.onMessage.addListener( request => {
    const notif = request.notification;
    if (notif) {
        const message = `Limit Price Reached - ${notif.crypto} - ${notif.zone} $${notif.price} ${notif.currency}`;
        alert(message); // display the message to the user
    }
    return true;
});