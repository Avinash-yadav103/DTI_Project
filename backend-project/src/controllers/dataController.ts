import { Request, Response } from 'express';
import DataService from '../services/dataService';

class DataController {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  public saveData = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const savedData = await this.dataService.saveData(data);
      res.status(201).json(savedData);
    } catch (error) {
      res.status(500).json({ message: 'Error saving data', error });
    }
  };

  public getData = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.dataService.getData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data', error });
    }
  };

  public deleteData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.dataService.deleteData(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting data', error });
    }
  };
}

export default DataController;