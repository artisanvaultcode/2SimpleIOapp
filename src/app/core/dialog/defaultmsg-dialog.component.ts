import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  msgdefault: string;
};

@Component({
  selector: 'app-defaultmsg-dialog',
  templateUrl: './defaultmsg-dialog.component.html',
  styleUrls: ['./defaultmsg-dialog.component.scss']
})
export class DefaultmsgDialogComponent implements OnInit {

  currentmsg: string = '';

  constructor(
    public dialogRef: MatDialogRef<DefaultmsgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.currentmsg = this.data.msgdefault;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
