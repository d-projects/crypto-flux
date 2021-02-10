chrome.runtime.onMessage.addListener( request => {
    const notifs = request.notifications;
    let message = '';
    notifs.forEach(notif => {
        message += `Limit Price Reached - ${notif.crypto} - $${notif.price} USD`;
    });
    alert(message); // finally display the message to the user
});