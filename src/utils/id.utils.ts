import { v4 } from 'uuid';

export class uuidv4 {
    public generate = (): string => {
        return v4();
    };
}
