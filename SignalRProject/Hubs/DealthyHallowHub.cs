using Microsoft.AspNetCore.SignalR;
using SignalRProject.Const;

namespace SignalRProject.Hubs
{
    public class DealthyHallowHub:Hub
    {

        public Dictionary<string,int> VotingDealthyHallowRace()
        {
            return SD.DealthyHallowRace;
        }
    }
}
