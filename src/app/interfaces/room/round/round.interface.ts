import { VoteInterface } from './vote/vote.interface';

export interface RoundInterface {
    id: string;
    title: string;
    description: string;
    resolved: boolean;
    votes: Record<string, VoteInterface>;
    created_at: Date;
}
