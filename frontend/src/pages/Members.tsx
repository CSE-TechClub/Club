import React, { useState } from "react";
import { Shield, Search, Linkedin, BracesIcon } from "lucide-react";

export const mockMembers = [
  {
    id: "1",
    name: "Keerthana M",
    role: "Lead",
    email: "placeholder1@example.com",
    linkedinUrl: "https://www.linkedin.com/in/keerthanakeerthana/",
    bio: "AI Avengers Lead",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D5603AQFchHgvr5EM8g/profile-displayphoto-shrink_800_800/B56ZWOUX19HQAg-/0/1741849466834?e=1748476800&v=beta&t=haOxkAlDMNjhuQoN9-lJNQigWLUxaMe6YzfvUuXyS8Y",
  },
  {
    id: "2",
    name: "Jananya K H",
    role: "Lead",
    email: "placeholder2@example.com",
    linkedinUrl: "https://www.linkedin.com/in/jananya-k-h/",
    bio: "Web Wizards Lead ",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D5603AQFJC5pNMZf6Jw/profile-displayphoto-shrink_200_200/B56ZaUFcVmHAAc-/0/1746241179055?e=1751500800&v=beta&t=JzPtt3AzwqWoEaeqsig3IvK0E7d5qf7f6yZ365uJX-Y",
  },
  {
    id: "15",
    name: "Gagan T P",
    role: "Lead",
    email: "placeholder3@example.com",
    linkedinUrl:"https://www.linkedin.com/in/gagan-tp-62ab89259/",
    bio: " Full-Stack Developer | Cyber Scholars Lead",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D5603AQHi1JlCsLbddg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724480102399?e=1750896000&v=beta&t=-BCktKXDhStfyFi9njfSg3S5Qvi2VrGTQ7qLdpj0Oc0",
  },
  {
    id: "3",
    name: "Jones Samuel",
    role: "volunteer",
    email: "placeholder3@example.com",
    linkedinUrl:"https://www.linkedin.com/in/jones-samuel-859b9024b/",
    bio: "Backend Developer | Club volunteer",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D5635AQEQkWsFwxzjYw/profile-framedphoto-shrink_200_200/B56ZWhubfbHEAY-/0/1742175058345?e=1746892800&v=beta&t=dow16dJwxvD442D09tmG0r1OBtxpnYZ0dlo9AGfBY1s",
  },

  {
    id: "4",
    name: "Chinmay L",
    role: "admin",
    email: "placeholder4@example.com",
    linkedinUrl: "https://www.linkedin.com/in/chinmay-l-39416125b/",
    bio: "Lead Developer | Dev Dynamos Lead",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D5603AQFoQkq8L7VPyg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729454804974?e=1750896000&v=beta&t=Lx1R-1af2zlHN3HBjmigWPwyGaKozvr5i0Mtg41WkXg",
  },

    {
      id: "5",
      name: "Vidya P B",
      role: "Club volunteer",
      email: "placeholder1@example.com",
      linkedinUrl: "https://www.linkedin.com/in/vidya-p-b-03955a25b",
      bio: "Club volunteer",
      imageUrl:
      "https://media.licdn.com/dms/image/v2/D5635AQGo-XIyXsIMZQ/profile-framedphoto-shrink_200_200/B56ZXEVxkPHsAY-/0/1742755797560?e=1746892800&v=beta&t=8Dbbr8rukCcMRm-jIIghb2VT4q_tui4rNDq61800paI",
      
    },
    {
      id: "6",
      name: "James J",
      role: "Club volunteer",
      email: "placeholder2@example.com",
      linkedinUrl: "https://www.linkedin.com/in/james-j-824780324/",
      bio: "Club volunteer",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D4E03AQHPdvLL2rCnIw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724487899674?e=1748476800&v=beta&t=-ka_w_Ns_MzXXISjBa0qklgZgCkl60HSCqIEW8DnE38",
    },
    {
      id: "7",
      name: "Sapna Kamthane",
      role: "Club volunteer",
      email: "placeholder3@example.com",
      linkedinUrl: "https://www.linkedin.com/in/sapna-kamthane-0661b5269",
      bio: "Club volunteer",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5635AQGGwrsleX6PuA/profile-framedphoto-shrink_200_200/B56ZWj3r5ZGQAY-/0/1742211039200?e=1746892800&v=beta&t=Y6hUEFUoy9WQWMJ8ap80wBW5IG-tu_a2mzNSM6RvThw",
    },
    {
      id: "8",
      name: "Rudresh Manjunath",
      role: "Lead",
      email: "placeholder4@example.com",
      linkedinUrl: "https://www.linkedin.com/in/rudresh-manjunath21/",
      bio: "Club volunteer | Phase-Changers Lead",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5635AQG-89qG5DZL9Q/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1724616225632?e=1746892800&v=beta&t=Kiwa8LJXIfBEq4KW-gKzjA80AgUgW8KS2-WhUwF1yjM",
    },
    {
      id: "9",
      name: "Inchara Manjunath Achar",
      role: "Club volunteer",
      email: "placeholder5@example.com",
      linkedinUrl: "https://www.linkedin.com/in/inchara-manjunath-achar-ba9703256/",
      bio: "Club volunteer",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQGoHAOO3JBD0Q/profile-displayphoto-shrink_800_800/B56ZXFq.QAGUAg-/0/1742778134597?e=1748476800&v=beta&t=BHpuF7X52HXz_wMPBlh3Gf2K28_qVqzmHDhnqwj8evM",
    },
    {
      id: "10",
      name: "Pragathi S",
      role: "Club volunteer",
      email: "placeholder6@example.com",
      linkedinUrl: "https://www.linkedin.com/in/pragathi-s-9a558b25b",
      bio: "Club volunteer",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQGRBzUN17vGwQ/profile-displayphoto-shrink_200_200/B56ZXGOZSdHsAc-/0/1742787418509?e=1751500800&v=beta&t=6W4MOC__MKUUKQfZAbuZp4cThejHR1ZnJR4LE_nQmyk",
    },
    {
      id: "11",
      name: "Bhavyashree K P",
      role: "Club volunteer",
      email: "placeholder7@example.com",
      linkedinUrl: "https://www.linkedin.com/in/bhavyashree-k-p-4329b6259/",
      bio: "Club volunteer",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQEnmQzMcdakPA/profile-displayphoto-shrink_200_200/B56ZXSvqMcHoAY-/0/1742997470143?e=1751500800&v=beta&t=ZQ7G9WKrbtqI5p1K6TqeMgw7i9SfhIkxkK-rDpoQYXc",
    },
    {
      id: "12",
      name: "Nisarga T K",
      role: "Club volunteer",
      email: "placeholder8@example.com",
      linkedinUrl: "https://www.linkedin.com/in/nisarga-t-k-a3b67425b/",
      bio: "Club volunteer",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5635AQHs89v88Rtbqw/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1733333581911?e=1746892800&v=beta&t=MUW-XLgkWTL7a3ipE37pZe0kXEHo9Mj_rcR1148pVw4",
    },
    {
      id: "13",
      name: "Chaitra Bai J R",
      role: "Club volunteer",
      email: "placeholder9@example.com",
      linkedinUrl: "https://www.linkedin.com/in/chaitra-bai-j-r-6a859125b",
      bio: "Club volunteer",
      imageUrl:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    },
    
];
function Members() {
 
  const [searchTerm, setSearchTerm] = useState("");
  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Club Members
        </h1>
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <div className="relative">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
              />
              {member.role === "admin" && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 text-xs rounded-full flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </div>
              )}
              {member.role === "Lead" && (
                <div className="absolute -top-2 -right-2 bg-green-600 text-white px-2 py-1 text-xs rounded-full flex items-center space-x-1">
                  <BracesIcon className="h-4 w-4" />
                  <span>Lead</span>
                </div>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {member.name}
            </h3>
            {/* <p className="text-gray-600">{member.email}</p> */}
            <p className="mt-2 text-gray-600">{member.bio}</p>
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-blue-600 hover:underline flex items-center space-x-1"
            >
              <Linkedin className="h-5 w-5" />
              
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Members;
