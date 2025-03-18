import { DataModel } from '../models/dataModel';

export class DataService {
    async saveData(data: any): Promise<DataModel> {
        const newData = new DataModel(data);
        return await newData.save();
    }

    async getData(id: string): Promise<DataModel | null> {
        return await DataModel.findById(id);
    }

    async deleteData(id: string): Promise<DataModel | null> {
        return await DataModel.findByIdAndDelete(id);
    }

    async getAllData(): Promise<DataModel[]> {
        return await DataModel.find();
    }
}