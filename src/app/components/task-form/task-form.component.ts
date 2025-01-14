import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})

export class TaskFormComponent implements OnInit  {
  taskForm: FormGroup;
  tasks: any[] = [];
  draft: any;
  taskFormValue: { title: string; description: string }[] = []


  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

   
  }
  ngOnInit(): void {
    this.taskForm.valueChanges.subscribe(value => {
      this.draft = value;
    });
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  generateDraft(): void {
    if (this.taskForm.valid) {
      const draft = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description
      };
      this.taskFormValue.push(draft);
      console.log('Bản nháp được tạo:', draft);
    }
  }

  submitDraft(draft: { title: string; description: string }): void {
    if (this.taskForm.valid) {
      this.taskService.saveTask(draft).subscribe(
        (response) => {
          console.log('Nhiệm vụ đã được lưu thành công!', response);
  
          this.taskFormValue = this.taskFormValue.filter(item => item !== draft);
  
          this.ngOnInit();
          alert('The mission has been saved successfully!');
        },
        (error) => {
          console.error('Lỗi khi lưu nhiệm vụ:', error);
        }
      );
    }
  }
  

}