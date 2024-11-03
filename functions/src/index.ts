import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios, {isAxiosError} from "axios";

admin.initializeApp();
const db = admin.firestore();

export const triggerPythonConversion = functions.storage
  .object()
  .onFinalize(async (object) => {
    const fileName = object.name;
    const metadata = object.metadata as { docId?: string };
    const docId = metadata?.docId;
    const filePath = `gs://${object.bucket}/${fileName}`;

    console.log(`Metadata: ${JSON.stringify(metadata)}`);
    console.log(`File name: ${fileName}`);
    console.log(`Doc ID: ${docId}`);
    console.log(`File path: ${filePath}`);

    console.log("Function triggered with object:", object);
    if (!fileName) {
      console.error("Missing fileName");
      return;
    }
    if (!docId) {
      console.error("Missing docId");
      return;
    }
    if (!filePath) {
      console.error("Missing filePath");
      return;
    }
    const docRef = db.collection("conversions").doc(docId);
    try {
      await docRef.update({status: "processing"});
      const conversionServiceUrl = functions.config().conversion_service.url;
      await axios.post(`${conversionServiceUrl}/convert`, {
        fileName,
        docId,
        filePath,
      });

      console.log(`Triggered Python service for file: ${fileName}`);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error triggering Python service:", error.response?.data);
      } else {
        console.error("Error triggering Python service:", error);
        await docRef.update({status: "error"});
      }
    }
  });
