using Microsoft.AspNetCore.SignalR;

namespace SignalRProject.Hubs
{
    public class NotificationHub:Hub
    {
        public static List<string> Notification {  get; set; }=new List<string>();

        public async Task PushNotifcation(string name)
        {
            Notification.Add(name);
            await LoadMessage();
        }

        public async Task LoadMessage()
        {
            await Clients.All.SendAsync("UserPushNotification", Notification);

        }
    }
}
