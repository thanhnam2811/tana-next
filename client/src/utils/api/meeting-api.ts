import axios from 'axios';

// //Auth token we will use to generate a meeting and connect to it
export const authToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2ZDRmNmVlMC0yZDczLTQ3MTctYjRjZC1iMmM5Zjc0ODYyYTQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4Mzk2ODQ2MCwiZXhwIjoxNzE1NTA0NDYwfQ.Ye1D39-ydNN_von-zL-EKMXaM2c9cGCWBxy880iuG0I';

// // API call to create meeting
// export const createMeeting = async ({ token }: { token: string }) => {
//   const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
//     method: "POST",
//     headers: {
//       authorization: `${authToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}),
//   });
//   //Destructuring the roomId from the response
//   const { roomId }: { roomId: string } = await res.json();
//   return roomId;
// };

export const meetingApi = {
	create: async () => {
		const res = await axios<{ roomId: string }>(`https://api.videosdk.live/v2/rooms`, {
			method: 'POST',
			headers: {
				authorization: `${authToken}`,
				'Content-Type': 'application/json',
			},
		});
		return res;
	},
};
