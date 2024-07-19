using Microsoft.AspNetCore.SignalR;

namespace SignalRProject.Hubs
{
    public class HouseHub:Hub
    {
        public static List<string> HouseGroup {  get; set; }=new List<string>();
        public async Task JoinGroup(string houseName)
        {
            if (!HouseGroup.Contains(Context.ConnectionId + ":" + houseName))
            {
                HouseGroup.Add(Context.ConnectionId + ":" + houseName);
                string houseList = "";
                foreach (string house in HouseGroup) 
                {
                    if (house.Contains(Context.ConnectionId))
                    {
                        houseList += house.Split(':')[1] + " ";
                    }
                }
                 await Clients.Caller.SendAsync("UpdateScribtionStatus", houseList, houseName, true);
                await Clients.Others.SendAsync("newmemberScribtion", houseName);

                await Groups.AddToGroupAsync(Context.ConnectionId, houseName);
            }
        }
        public async Task LeaveGroup(string houseName)
        {
            if (HouseGroup.Contains(Context.ConnectionId + ":" + houseName))
            {
                HouseGroup.Remove(Context.ConnectionId + ":" + houseName);
                string houseList = "";
                foreach (string house in HouseGroup)
                {
                    if (house.Contains(Context.ConnectionId))
                    {
                        houseList += house.Split(':')[1] + " ";
                    }
                }
                await Clients.Caller.SendAsync("UpdateScribtionStatus", houseList, houseName, false);
                await Clients.Others.SendAsync("lessmemberScribtion", houseName);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task TrigerNotification(string houseName)
        {
            await Clients.Group(houseName).SendAsync("trigerNotification", houseName);
        }
    }
}
