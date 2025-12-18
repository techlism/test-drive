export interface User {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
    createdAt: string;
}

export interface File {
    id: string;
    userId: string;
    name: string;
    storageKey: string;
    size: number;
    mimeType: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface FilesResponse {
    files: File[];
}