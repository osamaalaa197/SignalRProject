using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRProject.Const;
using SignalRProject.Data;
using SignalRProject.Hubs;
using SignalRProject.Models;
using SignalRProject.Models.ViewModel;
using System.Diagnostics;
using System.Security.Claims;

namespace SignalRProject.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		public IHubContext<DealthyHallowHub> _dalthyHollow {  get; set; }
        public IHubContext<OrderHub> _orderhub { get; set; }

        public readonly ApplicationDbContext _context;

		public HomeController(ILogger<HomeController> logger,IHubContext<DealthyHallowHub> hubContext,ApplicationDbContext dbContext,IHubContext<OrderHub> orderHub)
		{
			_logger = logger;
			_dalthyHollow = hubContext;
            _context = dbContext;
            _orderhub = orderHub;
		}

		public IActionResult Index()
		{
			_dalthyHollow.Clients.All.SendAsync("UpdateDealthyHallowRace",
			SD.DealthyHallowRace[SD.Cloak],
			SD.DealthyHallowRace[SD.Stone],
			SD.DealthyHallowRace[SD.Wand]).GetAwaiter().GetResult();
            return View();

        }
        public async Task<IActionResult> DealthyHallowRace(string type)
		{
            if (SD.DealthyHallowRace.ContainsKey(type))
            {
				SD.DealthyHallowRace[type]++;
            }
            await _dalthyHollow.Clients.All.SendAsync("UpdateDealthyHallowRace",
				SD.DealthyHallowRace[SD.Cloak],
				SD.DealthyHallowRace[SD.Stone],
				SD.DealthyHallowRace[SD.Wand]);
            return Accepted();
        }
		public IActionResult Notification()
		{
			return View();
		}
        public IActionResult Privacy()
		{
			return View();
		}
		public IActionResult BasicChat()
		{
			return View();
		}
		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

        [ActionName("Order")]
        public async Task<IActionResult> Order()
        {
            string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
            string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

            Random rand = new Random();
            // Generate a random index less than the size of the array.  
            int index = rand.Next(name.Length);

            Order order = new Order()
            {
                Name = name[index],
                ItemName = itemName[index],
                Count = index
            };

            return View("Order",order);
        }

        [ActionName("Order")]
        [HttpPost]
        public async Task<IActionResult> OrderPost(Order order)
        {

            _context.Orders.Add(order);
            _context.SaveChanges();
            await _orderhub.Clients.All.SendAsync("newOrder");
            return RedirectToAction(nameof(Order));
        }
        [ActionName("OrderList")]
        public async Task<IActionResult> OrderList()
        {
            return View();
        }
        [HttpGet]
        public IActionResult GetAllOrder()
        {
            var productList = _context.Orders.ToList();
            return Json(new { data = productList });
        }

        public IActionResult GetOrderById(int id)
        {
            var order = _context.Orders.FirstOrDefault(x => x.Id == id);
            return View("order",order);
        }
        [HttpPost]
        public async Task<IActionResult> EditOrder(Order order)
        {
            _context.Orders.Update(order);
            _context.SaveChanges();
			// Handel OrderHub
			await _orderhub.Clients.All.SendAsync("UpdateOrder", order.Name);
			return RedirectToAction(nameof(OrderList));
		}

        public IActionResult Chat()
        {
            var userId=User.FindFirstValue(ClaimTypes.NameIdentifier);
            ChatVM chatVm = new()
            {
                Rooms = _context.ChatRoom.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId,
            };
            return View(chatVm); 
        }

        public IActionResult AdvancedChat()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            ChatVM chatVm = new()
            {
                Rooms = _context.ChatRoom.ToList(),
                MaxRoomAllowed = 4,
                UserId = userId,
            };
            return View(chatVm);
        }

    }
}
