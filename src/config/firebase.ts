// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHixDOzSvwoHK0QsXyHhHhHpoDdPlnJcE",
  authDomain: "sistem-pendaftaran-penduduk.firebaseapp.com",
  projectId: "sistem-pendaftaran-penduduk",
  storageBucket: "sistem-pendaftaran-penduduk.appspot.com",
  messagingSenderId: "539172551591",
  appId: "1:539172551591:web:8b7c4cb9ddf75629a79482",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const firebaseSignUp = (email: string, password: string) =>
  new Promise((resolve, reject) =>
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => resolve(userCredential.user))
      .catch((error) => reject(error.message))
  );

export const firebaseSignIn = (email: string, password: string) =>
  new Promise((resolve, reject) =>
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => resolve(userCredential.user))
      .catch((error) => reject(error.message))
  );

export const firebaseAddData = (data: Object, path: string) =>
  new Promise((resolve, reject) =>
    addDoc(collection(getFirestore(), path), data)
      .then((docRef) => resolve(docRef))
      .catch((e) => reject(e))
  );

export const firebaseReadData = (path: string) =>
  new Promise((resolve, reject) =>
    getDocs(collection(getFirestore(), path))
      .then((querySnapshot) => {
        const data: any = [];
        querySnapshot.forEach((doc) =>
          data.push({ ...JSON.parse(JSON.stringify(doc.data())), id: doc.id })
        );
        resolve(data);
      })
      .catch((e) => reject(e))
  );

export const firebaseDeleteDocument = (path: string, id: string) =>
  new Promise((resolve, reject) =>
    deleteDoc(doc(getFirestore(), path, id))
      .then(() => resolve(true))
      .catch(() => reject(false))
  );

export const firebaseReadSingleData = (path: string, id: string) =>
  new Promise((resolve, reject) =>
    getDoc(doc(getFirestore(), path, id)).then((docSnap) =>
      docSnap.exists() ? resolve(docSnap.data()) : reject(false)
    )
  );

export const firebaseUpdateDocument = (
  path: string,
  id: string,
  data: Object
) =>
  new Promise(() =>
    setDoc(doc(getFirestore(), path, id), data)
      .then(() => console.log("sukses"))
      .catch(() => console.log("gagal"))
  );

export const firebaseUploadFile = (file: any, filename: string) =>
  new Promise((resolve, reject) =>
    uploadBytesResumable(ref(getStorage(), filename), file).on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => reject(error),
      () => {
        getDownloadURL(
          uploadBytesResumable(ref(getStorage(), filename), file).snapshot.ref
        ).then((downloadURL) => resolve(downloadURL));
      }
    )
  );
