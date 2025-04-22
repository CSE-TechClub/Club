import banner from "../assets/cybersec.jpg";

const Topics = [
  {
    name: "1. Cybersecurity Fundamentals",
    TechStack: "CIA Triad, Security Principles, Risk Management",
    Project: "Perform a security assessment of a sample application",
  },
  {
    name: "2. Networking & Protocols",
    TechStack: "TCP/IP, OSI Model, Wireshark",
    Project: "Analyze network traffic and identify anomalies",
  },
  {
    name: "3. Operating Systems & Hardening",
    TechStack: "Windows, Linux, Security Configuration",
    Project: "Harden a Linux VM and document changes",
  },
  {
    name: "4. Threats & Vulnerabilities",
    TechStack: "OWASP Top 10, CVE, Vulnerability Scanning (Nessus)",
    Project: "Run a vulnerability scan on a web app and report findings",
  },
  {
    name: "5. Ethical Hacking & Pentesting Basics",
    TechStack: "Kali Linux, Nmap, Metasploit",
    Project: "Perform reconnaissance and port scanning on a target VM",
  },
  {
    name: "6. Web Application Security",
    TechStack: "Burp Suite, SQL Injection, XSS",
    Project: "Exploit and patch a demo vulnerable web application",
  },
  {
    name: "7. Network Security & Firewalls",
    TechStack: "pfSense, IDS/IPS (Snort), VPN",
    Project: "Configure a firewall and simulate an intrusion",
  },
  {
    name: "8. Cryptography Essentials",
    TechStack: "Symmetric/Asymmetric Encryption, PKI, SSL/TLS",
    Project: "Implement encryption for files and secure communications",
  },
  {
    name: "9. Incident Response & Forensics",
    TechStack: "FTK Imager, Log Analysis, Memory Forensics",
    Project: "Investigate a mock security breach and write a report",
  },
  {
    name: "10. Cloud Security",
    TechStack: "AWS Security, IAM, CloudTrail, Kubernetes Security",
    Project: "Secure a sample application deployed on AWS",
  },
  {
    name: "11. Secure DevOps (DevSecOps)",
    TechStack: "CI/CD Security, SAST, DAST, IaC Scanning",
    Project: "Integrate security testing into a Jenkins pipeline",
  },
  {
    name: "12. Capstone Project & Certification Prep",
    TechStack: "Full-Stack Security, Exam Domains",
    Project: "Build and secure a full-stack app, prepare for CISSP/CEH",
  },
];

const Resources = [
  {
    link: "https://www.youtube.com/embed/videoseries?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_",
    title: "Cyber Security Training for Beginners (Edureka Playlist)",
    description:
      "A comprehensive beginner‑level playlist covering Cybersecurity fundamentals, threat modeling, risk management, and hands‑on labs to secure applications and networks.",
  },
  {
    link: "https://www.youtube.com/embed/9DrnMjs5UVA",
    title:
      "Ethical Hacking for Beginners | 5 Phases of Ethical Hacking (Edureka)",
    description:
      "Step through reconnaissance, scanning, gaining access, maintaining access, and covering tracks with real labs on Kali Linux—ideal for those new to pentesting.",
  },
  {
    link: "https://www.youtube.com/embed/k9ZigsW9il0",
    title: "Networking Tutorial for Beginners Full Course",
    description:
      "An end‑to‑end introduction to TCP/IP, the OSI model, LAN/WAN concepts, and packet analysis—perfect for building a solid networking foundation.",
  },
  {
    link: "https://www.youtube.com/embed/smuBRTv966I",
    title: "Penetration Testing Full Course 2025 | Simplilearn",
    description:
      "A deep dive into modern pentesting workflows using Nmap, Metasploit, vulnerability assessment tools, and reporting best practices—updated for 2025.",
  },
  {
    link: "https://www.youtube.com/embed/k-k1cfIOLnQ",
    title: "Network Security Tutorial For Beginners | Edureka",
    description:
      "Learn firewall configuration, IDS/IPS basics, VPN setup, and real‑world attack simulations to defend your network infrastructure.",
  },
  {
    link: "https://www.youtube.com/embed/videoseries?list=PLTnRtjQN5iea6dLA_4i3qFFX0kwvdL0bL",
    title: "HackerSploit Red & Blue Team Series",
    description:
      "Hands‑on red teaming and blue teaming tutorials, including network traffic analysis and defensive strategy labs.",
  },
  {
    link: "https://www.youtube.com/embed/oaCeV6MJZKQ",
    title: "Free Practical Ethical Hacking Course | The Cyber Mentor",
    description:
      "A 12‑hour, free ethical hacking course with real‑world penetration testing exercises on Kali Linux.",
  },
  {
    link: "https://www.youtube.com/embed/videoseries?list=UUa6eh7gCkpPo5XXUDfygQQA",
    title: "HackTheBox Walkthroughs | IppSec",
    description:
      "Extensive VM challenge walkthroughs and exploitation techniques, ideal for hands‑on practice.",
  },
  {
    link: "https://www.youtube.com/embed/videoseries?list=PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1P",
    title: "CCNA 200-301 Complete Course | NetworkChuck",
    description:
      "Comprehensive CCNA training covering switching, routing, wireless, and network security fundamentals.",
  },
  {
    link: "https://www.youtube.com/embed/LCec9K0aAkM",
    title: "Introduction To The MITRE ATT&CK Framework | HackerSploit",
    description:
      "An in‑depth overview of the MITRE ATT&CK matrix, tactics, techniques, and procedures for adversary modeling.",
  },
];

const CyberSecBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Cyber Scholars 🔐
      </h1>
      <img
        src={banner}
        alt="Cybersecurity Banner"
        className="w-full h-35 md:h-80 object-cover rounded-lg shadow-lg mb-6"
      />
      <p className="text-lg text-gray-700 mb-6">
        Cyber Scholars equips you with the knowledge to defend networks and
        systems from threats. From ethical hacking to secure coding, you'll
        learn how to protect data and digital infrastructure.
      </p>
      <h2 className="text-2xl font-semibold mb-4">🗺️ Roadmap</h2>
      <div className="max-w-5xl bg-white rounded-lg px-8 py-6 text-xl">
        <h3 className="text-xl font-semibold mb-4">
          Course Objectives, Projects & Outcomes
        </h3>
        <div className="flex flex-col gap-4 text-justify text-gray-600">
          <p>
            1. Master core cybersecurity principles (CIA Triad, risk management,
            threat modeling).
          </p>
          <p>
            2. Analyze network protocols and architectures (OSI/TCP‑IP), capture
            & inspect traffic with Wireshark.
          </p>
          <p>
            3. Conduct ethical hacking & penetration tests using Kali Linux
            tools (Nmap, Metasploit, Burp Suite).
          </p>
          <p>
            4. Secure and harden operating systems and network devices
            (firewalls, IDS/IPS, VPNs).
          </p>
          <p>
            5. Implement cryptography & secure communications (SSL/TLS, PKI) and
            manage IAM controls.
          </p>
          <p>
            6. Perform incident response & digital forensics; investigate
            breaches and produce professional reports.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-4 mb-4">
        Topics, Content and Timeline(12week)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
        {Topics.map((topic) => (
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
            <p className="text-blue-600">{topic.TechStack}</p>
            <p className="text-gra-600">{topic.Project}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mt-4 mb-4">References</h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
        {Resources.map((links) => (
          <div className="card hover:shadow-lg transition-shadow p-4 rounded bg-white">
            <div className="aspect-w-16 aspect-h-10 mb-4">
              <iframe
                src={links.link}
                title={links.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <p className="text-gray-600">{links.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberSecBlog;
