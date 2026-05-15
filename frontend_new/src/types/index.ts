export interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number;
    exam_pattern?: string;
}

export interface Module {
    number: number;
    title: string;
    completed: boolean;
    active?: boolean;
}

export interface ChatMessage {
    role: 'ai' | 'user';
    content: string;
}
