export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
}

export interface UserProfile extends Creator {
  email: string;
  bio: string;
  following: number;
  totalLikes: number;
}
