﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRProject.Data;
using SignalRProject.Models;

namespace SignalRProject.Controllers
{
	[Route("/[controller]")]
	[ApiController]
    public class ChatRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatRoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ChatRooms
        [HttpGet]
		[Route("/[controller]/GetChatRoom")]
		public async Task<ActionResult<IEnumerable<ChatRoom>>> GetChatRoom()
        {
          if (_context.ChatRoom == null)
          {
              return NotFound();
          }
            var res = await _context.ChatRoom.ToListAsync();
            return res;
        }

        // GET: api/ChatRooms/5
        [HttpGet("{id}")]
		[Route("/[controller]/GetChatRoom")]

		public async Task<ActionResult<ChatRoom>> GetChatRoom(int id)
        {
          if (_context.ChatRoom == null)
          {
              return NotFound();
          }
            var chatRoom = await _context.ChatRoom.FindAsync(id);

            if (chatRoom == null)
            {
                return NotFound();
            }

            return chatRoom;
        }



        // POST: api/ChatRooms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
		[Route("/[controller]/PostChatRoom")]
		public async Task<ActionResult<ChatRoom>> PostChatRoom(ChatRoom chatRoom)
        {
          if (_context.ChatRoom == null)
          {
              return Problem("Entity set 'ApplicationDbContext.ChatRoom'  is null.");
          }
            _context.ChatRoom.Add(chatRoom);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChatRoom", new { id = chatRoom.Id }, chatRoom);
        }

        // DELETE: api/ChatRooms/5
        [HttpDelete("{id}")]
		[Route("/[controller]/DeleteChatRoom/{id}")]

		public async Task<IActionResult> DeleteChatRoom(int id)
        {
            if (_context.ChatRoom == null)
            {
                return NotFound();
            }
            var chatRoom = await _context.ChatRoom.FindAsync(id);
            if (chatRoom == null)
            {
                return NotFound();
            }

            _context.ChatRoom.Remove(chatRoom);
            await _context.SaveChangesAsync();
            var room = await _context.ChatRoom.FirstOrDefaultAsync();
            return Ok(new {deleted=id,selected=(room==null?0:room.Id)});
            //return NoContent();
        }

		[HttpGet]
		[Route("/[controller]/GetChatUser")]
		public async Task<ActionResult<Object>> GetChatUser()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var users = await _context.Users.ToListAsync();

			if (users == null)
			{
				return NotFound();
			}

			return users.Where(u => u.Id != userId).Select(u => new { u.Id, u.UserName }).ToList();
		}
	}
}
