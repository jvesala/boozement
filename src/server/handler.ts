import { Request, Response } from 'express';

export const tryCatchHandler = async (
    req: Request,
    res: Response,
    fn: () => void
): Promise<void> => {
    try {
        console.log(`${req.method} ${req.url}`, req.body);
        fn();
    } catch (e) {
        console.log('API error', e);
        res.status(500).json(JSON.stringify({ msg: e.message }));
    }
};
