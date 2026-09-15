import type { Creator, UserProfile } from "@/types/user";

const av = (seed: string) => `https://i.pravatar.cc/200?u=${seed}`;

export const mockCreators: Creator[] = [
  {
    id: "u1",
    name: "Mira Kalyan",
    username: "mirakalyan",
    avatar: av("mira"),
    followers: 128400,
    isFollowing: false,
  },
  {
    id: "u2",
    name: "Devraj Sen",
    username: "devcooks",
    avatar: av("devraj"),
    followers: 54210,
    isFollowing: true,
  },
  {
    id: "u3",
    name: "Nina Ortega",
    username: "ninaonroute",
    avatar: av("nina"),
    followers: 902300,
    isFollowing: false,
  },
  {
    id: "u4",
    name: "Kabir Rao",
    username: "kabirbuilds",
    avatar: av("kabir"),
    followers: 23980,
    isFollowing: false,
  },
  {
    id: "u5",
    name: "Ayo Bello",
    username: "ayolaughs",
    avatar: av("ayo"),
    followers: 411000,
    isFollowing: true,
  },
];

export const mockMe: UserProfile = {
  id: "me",
  name: "Alex Fernandes",
  username: "alexf",
  avatar: av("alexf"),
  email: "alex@lumo.app",
  bio: "Chasing sunsets and shipping side projects. Occasional chef.",
  followers: 3820,
  following: 214,
  totalLikes: 48120,
  isFollowing: false,
};
