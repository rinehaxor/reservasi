'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAtom } from 'jotai';
import { roomsAtom } from '@/components/atoms/store';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

export default function ReadRoom() {
   const [rooms, setRooms] = useAtom(roomsAtom);
   const supabase = createClient();
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [editingRoom, setEditingRoom] = useState(null);
   const [open, setOpen] = useState(false);

   //protected user
   useEffect(() => {
      async function checkUserAccess() {
         const {
            data: { user },
         } = await supabase.auth.getUser();

         if (!user) {
            return redirect('/login');
         }

         const roleId = await getUserRole(user.id);

         if (roleId !== 2) {
            // asumsikan 2 adalah 'admin'
            return redirect('/'); // Redirect user biasa ke homepage
         }
      }

      checkUserAccess();
   }, [supabase]);

   async function getUserRole(userId) {
      const { data, error } = await supabase.from('user_roles').select('role_id').eq('user_id', userId).single();

      if (error) {
         console.error('Error fetching user role:', error);
         return null;
      }

      return data.role_id;
   }

   // Fetch rooms
   useEffect(() => {
      const fetchRooms = async () => {
         const { data, error } = await supabase.from('rooms').select('*');
         if (error) {
            console.error('Error fetching rooms:', error);
         } else {
            setRooms(data);
         }
      };

      fetchRooms();
   }, [setRooms]);

   console.log(rooms);
   //delete
   const deleteRoom = async (roomId: any) => {
      const { data, error } = await supabase.from('rooms').delete().match({ id: roomId });

      if (error) {
         console.error('Error deleting room:', error);
         return { error };
      }

      return { data };
   };

   const handleDelete = async (roomId) => {
      const { error } = await deleteRoom(roomId);
      if (!error) {
         setRooms(rooms.filter((room) => room.id !== roomId));
      } else {
         alert('Failed to delete room');
      }
   };

   //edit kamar
   const openEditModal = (room) => {
      setEditingRoom(room);
      setIsEditModalOpen(true);
   };

   const closeEditModal = () => {
      setIsEditModalOpen(false);
      setEditingRoom(null);
   };
   const updateRoom = async (room) => {
      const { data, error } = await supabase
         .from('rooms')
         .update({
            name: room.name,
            type: room.type,
            description: room.description,
            price_per_night: room.price_per_night,
         })
         .match({ id: room.id });
      console.log(data);
      if (error) {
         console.error('Error updating room:', error);
         alert('Failed to update room');
      } else {
         alert('Room updated successfully!');
         closeEditModal();
         //  setRooms((prevRooms) => prevRooms.map((r) => (r.id === room.id ? { ...r, ...data[0] } : r)));
      }
   };

   console.log(isEditModalOpen);

   return (
      <div>
         <table>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Price Per Night</th>
               </tr>
            </thead>
            <tbody>
               {rooms.map((room) => (
                  <div key={room.id}>
                     <h2>{room.name}</h2>
                     <p>Type: {room.type}</p>
                     <p>Description: {room.description}</p>
                     <p>${room.price_per_night} per night</p>
                     <img src={room.image_url} alt={`Image of ${room.name}`} style={{ width: '100px', height: '100px' }} />
                     <button onClick={() => handleDelete(room.id)}>Delete</button>
                     <button onClick={() => openEditModal(room)}>Edit</button>
                  </div>
               ))}
            </tbody>
         </table>
         <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
            <DialogTrigger asChild>
               <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <input value={editingRoom ? editingRoom.name : ''} onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })} placeholder="Room Name" />
                  <input value={editingRoom ? editingRoom.type : ''} onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })} placeholder="Room Type" />
                  <textarea value={editingRoom ? editingRoom.description : ''} onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })} placeholder="Description" />
                  <input value={editingRoom ? editingRoom.price_per_night : ''} onChange={(e) => setEditingRoom({ ...editingRoom, price_per_night: e.target.value })} placeholder="Price Per Night" />
               </div>
               <DialogFooter>
                  <Button type="submit" onClick={() => updateRoom(editingRoom)}>
                     Update Room
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
