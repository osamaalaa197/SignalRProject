using Microsoft.AspNetCore.SignalR;

namespace SignalRProject.Hubs
{
	public class UserHub:Hub
	{
		public static int TotalUserCount { get; set; } = 0;
		public static int TotalUserConnected {  get; set; } = 0;
		public override Task OnConnectedAsync()
		{
			TotalUserConnected++;
			Clients.All.SendAsync("UpdateTotalUser", TotalUserConnected).GetAwaiter().GetResult();
			return base.OnConnectedAsync();
		}
		public override Task OnDisconnectedAsync(Exception? exception)
		{
			TotalUserConnected--;
			Clients.All.SendAsync("UpdateTotalUser", TotalUserConnected).GetAwaiter().GetResult();
			return base.OnDisconnectedAsync(exception);
		}
		public async Task NewPageLoaded()
		{
			TotalUserCount++;
			await Clients.All.SendAsync("UpdateUserCount", TotalUserCount);
		}


	}
}
