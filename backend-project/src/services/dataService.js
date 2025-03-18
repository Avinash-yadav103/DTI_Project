import { DataModel } from '../models/dataModel';

export class DataService {
    async saveData(data) {
        const newData = new DataModel(data);
        return await newData.save();
    }

    async getData(id) {
        return await DataModel.findById(id);
    }

    async deleteData(id) {
        return await DataModel.findByIdAndDelete(id);
    }

    async getAllData() {
        return await DataModel.find();
    }
}