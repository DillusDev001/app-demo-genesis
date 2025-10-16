import { inject, Injectable } from "@angular/core";
import { Auth, authState } from "@angular/fire/auth";
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, QueryConstraint, setDoc, updateDoc, where, writeBatch } from "@angular/fire/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "@angular/fire/storage";
import { filter, map, Observable } from "rxjs";
import { defaultResultFirebase, ResultFirebase } from "../interfaces/api/result-firebase.interface";
import { FileArrayObj } from "../interfaces/file-array-obj.interface";

@Injectable({
  providedIn: "root"
})
export class FirebaseGenesisService {
  /** ---------------------------------------- Variablesde Inicio ---------------------------------------- **/
  // Inyección de dependencias con inject()
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  user$: Observable<any>;
  /** ---------------------------------------- Constructor ---------------------------------------- **/
  constructor() {
    this.user$ = authState(this.auth).pipe(
      filter(user => user !== null),
      map(user => user!)
    );
  }

  /** ---------------------------------------- Consultas Firebase ---------------------------------------- **/
  async existDoc(coleccion: string, campo: string, valor: string): Promise<Boolean> {
    try {
      const db = collection(this.firestore, coleccion);
      const consulta = query(db, where(campo, "==", valor));
      const data = await getDocs(consulta);

      return data.docs.length > 0;
    } catch (error: any) {
      return false;
    }
  }

  async findDocByField<T>(coleccion: string, campo: string, valor: string): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    try {
      const db = collection(this.firestore, coleccion);
      const consulta = query(db, where(campo, "==", valor));
      const data = await getDocs(consulta);

      if (data.docs.length === 1) {
        result.success = true;
        result.data = data.docs[0].data() as T;
      } else {
        result.message = "Se encontraron " + data.docs.length + " coincidencia(s).";
      }
    } catch (error: any) {
      console.log("existeDocumento: ", error.message);
      result.message = "Error al buscar documento. " + error.message;
      result.error = error;
    }

    return result;
  }

  /** ---------------------------------------- Create Doc Firebase ---------------------------------------- **/
  async createDoc<T>(coleccion: string, data: any): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    try {
      //const db = collection(this.firestore, coleccion);
      const reference = collection(this.firestore, coleccion);
      const create = await addDoc(reference, data);

      result.data = create.id as T;
      result.success = true;
    } catch (error: any) {
      console.log("createDoc: ", error.message);
      result.message = "Error al crear documento. " + error.message;
      result.error = error;
    }

    return result;
  }

  async createDocWithID<T>(coleccion: string, customId: string, data: any): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    try {
      const docRef = doc(this.firestore, coleccion, customId);
      const set = await setDoc(docRef, data);

      result.message = "Se ha creado correctamente.";
      result.data = set as T;
      result.success = true;
    } catch (error: any) {
      console.log("createDoc: ", error);
      result.message = "Error al crear documento. " + error.message;
      result.error = error;
    }

    return result;
  }

  /** ---------------------------------------- Update Doc Firebase ---------------------------------------- **/
  async updateDoc<T>(coleccion: string, data: any, id: string): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    try {
      const db = collection(this.firestore, coleccion);
      const docRef = doc(db, id);
      const update = await updateDoc(docRef, data);

      result.message = "Se actualizó correctamente.";
      result.data = update as T;
      result.success = true;
    } catch (error: any) {
      console.log("updateDoc: ", error.message);
      result.message = "Error al actualizar documento. " + error.message;
      result.error = error;
    }

    return result;
  }

  /** ---------------------------------------- Delete Doc Firebase ---------------------------------------- **/
  async deleteDoc<T>(coleccion: string, docId: string): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    try {
      const docRef = doc(this.firestore, coleccion, docId);

      await deleteDoc(docRef);

      result.success = true;
      result.message = "Documento eliminado correctamente";
    } catch (error: any) {
      console.error("deleteDoc error:", error.message);
      result.message = "Error al eliminar el documento. " + error.message;
      result.error = error;
    }

    return result;
  }

  /** ---------------------------------------- Multiple Create Doc Firebase ---------------------------------------- **/
  async multipleCreate<T>(coleccion: string, data: any[], idAtri?: string): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    const collectionRef = collection(this.firestore, coleccion); 

    try {
      // const collectionRef = collection(this.firestore, coleccion);
      const batch = writeBatch(this.firestore);

      // Itera sobre el array de datos y agrega una operación "set" por cada elemento
      data.forEach(item => {
        let docRef;
        if(idAtri){
          docRef = doc(this.firestore, coleccion, item[idAtri]);
        }else {
          docRef = doc(collectionRef);
        }
        batch.set(docRef, item);
      });

      await batch.commit();

      result.success = true;
      result.message = "La colección se agregó correctamente.";

    } catch (error: any) {
      console.error("createMultipleDocs error:", error);
      result.message = "Error al crear múltiples documentos en la colección " + coleccion + ". " + error.message;
      result.error = error;
    }

    return result;
  }

  /** ---------------------------------------- UpLoad File Firebase ---------------------------------------- **/
  /**
   * @param upLoadFile 
   * @param path ->/profile/participantes/id.jpg
   * @returns 
   */
  async upLoadFile<T>(file: FileArrayObj): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    // validar si es null
    if (!file.file) {
      result.message = "El archivo no es válido (null o undefined).";
      return result;
    }

    try {
      const metadata: any = { contentType: file.file.type };

      console.log("File type: ", file.file.type)
      const storage = getStorage();
      const storageRef = ref(storage, file.path);
      const uploadTask = await uploadBytesResumable(storageRef, file.file, metadata);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      result.success = true;
      result.message = downloadURL;
      result.data = uploadTask as T;
    } catch (error: any) {
      result.message = "Error a subir el archivo. " + error.message;
      result.error = error;
    }

    return result;
  }

  /**
   * @param filesToUpload:  FileArrayObj[] -> FileArrayObj = { file: File, path: string }
   * @returns 
   */
  async upLoadFilesArray<T>(filesToUpload: FileArrayObj[]): Promise<ResultFirebase<T>> {
    const result = defaultResultFirebase<T>();

    // 1. Validar que el array no esté vacío
    if (!filesToUpload || filesToUpload.length === 0) {
      result.message = "No se proporcionaron archivos para subir.";
      return result;
    }

    try {
      const storage = getStorage();

      // 2. Crear el array de promesas usando tu estructura
      const uploadPromises = filesToUpload.map(async item => {
        // Usamos el "path" que viene en cada objeto
        const storageRef = ref(storage, item.path);
        const metadata = { contentType: item.file.type };

        // La lógica de subida y obtención de URL es la misma
        const uploadTask = await uploadBytesResumable(storageRef, item.file, metadata);
        return await getDownloadURL(uploadTask.ref);
      });

      // 3. Esperar a que todas las subidas se completen
      const downloadURLs = await Promise.all(uploadPromises);

      // 4. Devolver el resultado
      result.success = true;
      result.message = "Todos los archivos se subieron correctamente.";
      result.data = downloadURLs as T; // El array de URLs

    } catch (error: any) {
      result.message = "Error al subir los archivos. " + error.message;
      result.error = error;
    }

    return result;
  }


  /** ---------------------------------------- Delete File Firebase ---------------------------------------- **/
  async deleteFile<T>(path: string): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    try {
      const storage = getStorage();
      const fileRef = ref(storage, path);

      await deleteObject(fileRef);

      result.success = true;
      result.message = "Archivo eliminado correctamente";
    } catch (error: any) {
      console.error("deleteFile error: ", error.message);
      result.message = "Error al eliminar el archivo. " + error.message;
      result.error = error;
    }

    return result;
  }

  async deleteFilesArray<T>(paths: string[]): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();

    // 1. Validar que el array de rutas no esté vacío
    if (!paths || paths.length === 0) {
      result.message = "No se proporcionaron rutas de archivos para eliminar.";
      return result;
    }

    try {
      const storage = getStorage();

      // 2. Crear un array de promesas de eliminación usando .map()
      const deletePromises = paths.map(path => {
        const fileRef = ref(storage, path);
        return deleteObject(fileRef); // deleteObject devuelve una promesa
      });

      // 3. Esperar a que todas las promesas de eliminación se completen
      await Promise.all(deletePromises);

      result.success = true;
      result.message = "Todos los archivos fueron eliminados correctamente.";

    } catch (error: any) {
      console.error("deleteFiles error:", error.message);
      // Firebase puede dar errores específicos, como "storage/object-not-found"
      // si un archivo ya no existe, lo cual podrías querer manejar.
      result.message = "Error al eliminar los archivos. " + error.message;
      result.error = error;
    }

    return result;
  }

  /** ---------------------------------------- Busqueda Firebase ---------------------------------------- **/
  async busquedaQuery<T>(coleccion: string, constraints: QueryConstraint[]): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();
    try {
      const collectionRef = collection(this.firestore, coleccion);
      const consulta = query(collectionRef, ...constraints);
      const data = await getDocs(consulta);

      if (!data.empty) {
        result.success = true;
        result.data = data.docs.map(doc => doc.data() as any) as T;
      } else {
        result.message = "No se encontraron coincidencias.";
      }
    } catch (error: any) {
      console.log("busquedaMultiple: ", error);
      result.message = "Error al obtener los datos. " + error.message;
      result.error = error;
    }
    return result;
  }

  async busquedaQueryID<T>(coleccion: string, constraints: QueryConstraint[]): Promise<ResultFirebase<T>> {
    let result = defaultResultFirebase<T>();
    try {
      const collectionRef = collection(this.firestore, coleccion);
      const consulta = query(collectionRef, ...constraints);
      const data = await getDocs(consulta);

      if (!data.empty) {
        result.success = true;
        result.data = data.docs.map(doc => {
          return{
            id:doc.id,
            ...doc.data()
          }
        }) as T;
      } else {
        result.message = "No se encontraron coincidencias.";
      }
    } catch (error: any) {
      console.log("busquedaMultiple: ", error);
      result.message = "Error al obtener los datos. " + error.message;
      result.error = error;
    }
    return result;
  }

  generateUUID(coleccion: string): string {
    const docRef = doc(collection(this.firestore, coleccion));
    return docRef.id;
  }
}
